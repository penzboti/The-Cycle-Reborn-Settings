// Q: separate the functions?
use mongodb::{
    bson::{doc, Document},
    sync::{Client, Collection, Database},
};
use serde_json::Value;

const URI: &str = "mongodb://localhost:27017";
lazy_static::lazy_static! {
    // TODO: check for connectivity and if not found, make sure to alert the user.
    // then wait until the connection is reestablished
    static ref client: Client = Client::with_uri_str(URI).unwrap();
    static ref database: Database = client.database("ProspectDb");
    static ref settings: Collection<Document> = database.collection("PlayFabUserData");
    static ref folder: String = format!("{}\\cycle-reborn-settings\\", std::env::var("APPDATA").unwrap());
}

#[tauri::command]
fn get_data(key: String) -> String {
    // println!("Getting: {}", key);
    // Q: returning errors at all?
    let entry = settings
        .find_one(doc! { "Key": key })
        .run()
        .unwrap()
        .unwrap();
    let value = entry.get("Value").unwrap().as_str().unwrap();
    value.to_owned()
}

#[tauri::command]
fn write_data(key: String, value: String) -> bool {
    // println!("Writing: {}", key);
    let filter_doc = doc! { "Key": key };
    let update_doc = doc! {
        "$set": doc! { "Value": value }
    };

    let res = settings.update_one(filter_doc, update_doc).run();
    res.is_ok()
}

#[tauri::command]
fn add_item(mut json: String) -> (bool, String) {
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned());

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

    let res = write_data(KEY.to_owned(), inv_str.to_owned());
    (res, id)
}

#[tauri::command]
fn remove_item(id: String) -> bool {
    println!("Removing: {}", id);
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned());
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

    // TODO: custom error codes https://github.com/tauri-apps/tauri/discussions/6952
    if initial_inv == inv_str {
        return false;
    }
    let res = write_data(KEY.to_owned(), inv_str.to_owned());
    res
}

#[tauri::command]
fn equip_item(id: String, slot: String, remove: bool) -> bool {
    println!("Equipping: {} into {}", id.clone(), slot.clone());
    const KEY: &str = "LOADOUT";
    let mut loadout_str = get_data(KEY.to_owned());
    let mut json: Value = serde_json::from_str(&loadout_str.as_str()).unwrap();

    if vec!["shield", "helmet", "weaponOne", "weaponTwo", "bag"].contains(&slot.as_str()) {
        if let Some(data) = json.get_mut(slot.clone()) {
            let string = if !remove { id.clone() } else { "".to_owned() };
            *data = Value::String(string);
        }
    } else {
        if let Some(data) = json.get_mut(slot.clone()) {
            let string = data.as_str().unwrap();
            let mut container: Value = serde_json::from_str(&string).unwrap();

            if let Some(value) = container.get_mut("m_bagItemsIds") {
                let mut array = value.as_array().unwrap().clone();
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
            }

            let after_string = serde_json::to_string(&container).unwrap();
            *data = Value::String(after_string);
        }
    }

    loadout_str = serde_json::to_string(&json).unwrap();
    let replaced_string = loadout_str.replace("\\\"", "\\u0022");

    let res = write_data(KEY.to_owned(), replaced_string.to_owned());
    res
}

#[tauri::command]
fn write_kit_data(_write: String) -> String {
    let file =  format!("{}/kits.json",folder.clone());
    println!("{}", file);
    file
}

// so if im not using mobile, i dont have to have these here?
// #[cfg_attr(mobile, tauri::mobile_entry_point)]
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
