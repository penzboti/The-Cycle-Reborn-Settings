use mongodb::{
    bson::{doc, Document},
    sync::{Client, Collection, Database},
};
use serde_json::Value;
use std::fs;

const URI: &str = "mongodb://localhost:27017";
lazy_static::lazy_static! {
    // TODO: check for connectivity and if not found, make sure to alert the user.
    // then wait until the connection is reestablished
    static ref client: Client = Client::with_uri_str(URI).unwrap();
    static ref database: Database = client.database("ProspectDb");
    static ref settings: Collection<Document> = database.collection("PlayFabUserData");
    // C:\Users\{username}\AppData\Roaming\com.cycle-reborn-settings.app
    static ref folder: String = format!("{}\\com.cycle-reborn-settings.app\\", std::env::var("APPDATA").unwrap());
    // ONLY FOR TESTING; YOU WON'T BE ABLE TO USE THE SETTINGS; LOADOUT; STASH TABS (soft-crash)
    // /home/{username}/.local/share/com.cycle-reborn-settings.app
    // static ref folder: String = format!("{}/.local/share/com.cycle-reborn-settings.app/", std::env::var("HOME").unwrap());
}

#[tauri::command]
fn get_data(key: String) -> Result<String, String> {
    // println!("Getting: {}", key);
    let entry = settings
        .find_one(doc! { "Key": key.clone() })
        .run()
        .map_err(|_| "error while searching for the data file")?
        .ok_or(format!("{}, is not a data file", key.clone()))?;
    let value = entry.get("Value").unwrap().as_str().unwrap();
    Ok(value.to_owned())
}

#[tauri::command]
fn write_data(key: String, value: String) -> Result<(), String> {
    // println!("Writing: {}", key);
    let filter_doc = doc! { "Key": key };
    let update_doc = doc! {
        "$set": doc! { "Value": value }
    };

    let res = settings
        .update_one(filter_doc, update_doc)
        .run()
        .map_err(|_| "couldn't update the data file".to_owned())
        .map(|_| ());
    res
}

#[tauri::command]
fn add_item(mut json: String) -> Result<String, String> {
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned())?;

    let uuid: String = uuid::Uuid::new_v4().as_u128().to_string();
    let id: String = format!("TCRS{}", uuid.as_str());
    json = json.replace("UUIDV4", id.as_str());
    println!("Adding: {}", json);

    let checkchar: char = inv_str.chars().nth(1).unwrap();
    if checkchar == '{' {
        inv_str.insert(1, ',');
    }
    for c in json.chars().rev() {
        inv_str.insert(1, c);
    }
    let res = write_data(KEY.to_owned(), inv_str.to_owned()).map(|_| id);
    res
}

#[tauri::command]
fn remove_item(id: String) -> Result<(), String> {
    println!("Removing: {}", id);
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned())?;
    let initial_inv = inv_str.clone();

    // remove first 2 and last 2 characters to not interfere
    // this means: "[{" & "}]"
    let mut iter = inv_str.chars();
    iter.next();
    iter.next();
    iter.next_back();
    iter.next_back();
    inv_str = iter.as_str().to_owned();

    // now we can go item by item normally
    inv_str = inv_str
        .split("},{")
        .into_iter()
        .filter(|x| !x.contains(id.as_str()))
        .collect::<Vec<&str>>()
        .join("},{");
    // if there are no items left we dont need the extra curly braces
    if inv_str != "" {
        inv_str.insert(0, '{');
        inv_str.insert(inv_str.len(), '}');
    }
    inv_str.insert(0, '[');
    inv_str.insert(inv_str.len(), ']');

    if initial_inv == inv_str {
        return Ok(());
    }
    let res = write_data(KEY.to_owned(), inv_str.to_owned());
    res
}

#[tauri::command]
fn equip_item(id: String, slot: String, remove: bool) -> Result<(), String> {
    println!("Equipping: {} into {}", id.clone(), slot.clone());
    const KEY: &str = "LOADOUT";
    let mut loadout_str = get_data(KEY.to_owned())?;
    let mut json: Value =
        serde_json::from_str(&loadout_str.as_str()).map_err(|_| "failed to parse json")?;

    if vec!["shield", "helmet", "weaponOne", "weaponTwo", "bag"].contains(&slot.as_str()) {
        if let Some(data) = json.get_mut(slot.clone()) {
            let string = if !remove { id.clone() } else { "".to_owned() };
            *data = Value::String(string);
        } else {
            return Err("couldn't mutate json".to_owned());
        }
    } else {
        if let Some(data) = json.get_mut(slot.clone()) {
            let string = data.as_str().ok_or("value is not a string")?;
            let mut container: Value =
                serde_json::from_str(&string).map_err(|_| "failed to parse json")?;

            if let Some(value) = container.get_mut("m_bagItemsIds") {
                let mut array = value.as_array().ok_or("value is not an array")?.clone();
                if !remove {
                    array.push(Value::String(id));
                } else {
                    array = array
                        .clone()
                        .iter()
                        .filter(|&s| s != &Value::String(id.clone()))
                        .map(|x| x.clone())
                        .collect();
                }
                *value = Value::Array(array);
            } else {
                return Err("couldn't mutate json".to_owned());
            }

            let after_string =
                serde_json::to_string(&container).map_err(|_| "failed to stringify json")?;
            *data = Value::String(after_string);
        } else {
            return Err("couldn't mutate json".to_owned());
        }
    }

    loadout_str = serde_json::to_string(&json).map_err(|_| "failed to stringify json")?;
    let replaced_string = loadout_str.replace("\\\"", "\\u0022");

    let res = write_data(KEY.to_owned(), replaced_string.to_owned());
    res
}

#[tauri::command]
fn write_kit_data(write: String) -> Result<(), String> {
    let filepath = format!("{}kits.json", folder.clone());

    // create folder
    if !fs::exists(folder.clone()).map_err(|_| "cant check for existence")? {
        let newfolder =
            fs::create_dir(folder.clone()).map_err(|_| "failed to create the appdata folder")?;
        println!("created folder: {:?}", newfolder);
    }

    // it automatically creates the file if it doesn't exist
    let res = fs::write(filepath, write)
        .map_err(|_| "failed to write to kit file".to_owned())
        .map(|_| ());
    res
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_data,
            write_data,
            add_item,
            remove_item,
            equip_item,
            write_kit_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
