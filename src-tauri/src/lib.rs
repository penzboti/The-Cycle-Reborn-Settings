use mongodb::{
    bson::{doc, Document},
    sync::{Client, Collection, Database},
};
// use serde_json::{from_str, to_string, Map, Value};

const URI: &str = "mongodb://localhost:27017";
lazy_static::lazy_static! {
    static ref client: Client = Client::with_uri_str(URI).unwrap();
    static ref database: Database = client.database("ProspectDb");
    static ref settings: Collection<Document> = database.collection("PlayFabUserData");
}

#[tauri::command]
fn get_data(key: String) -> String {
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
    let filter_doc = doc! { "Key": key };
    let update_doc = doc! {
        "$set": doc! { "Value": value }
    };

    let res = settings.update_one(filter_doc, update_doc).run();
    res.is_ok()
}

#[tauri::command]
fn add_item(mut json: String) -> (bool, String) {
    // println!("{}", json);
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned());
    // println!("{}", inv_str);

    let id: String = uuid::Uuid::new_v4().as_u128().to_string();
    // println!("{}", id);
    json = json.replace("UUIDV4", format!("TCRS{}", id.as_str()).as_str());
    println!("Adding: {}", json);

    let checkchar: char = inv_str.chars().nth(1).unwrap();
    if checkchar == '{' {
        inv_str.insert(1, ',');
    }
    for c in json.chars().rev() {
        inv_str.insert(1, c);
    }

    // println!("{}", inv_str);
    let res = write_data(KEY.to_owned(), inv_str.to_owned());
    (res, id)
}

#[tauri::command]
fn remove_item(id: String) -> bool {
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned());
    let initial_inv = inv_str.clone();
    // println!("{}", inv_str);

    // remove first 2 and last 2 characters to not interfere
    // this means: "[{" & "}]"
    let mut iter = inv_str.chars();
    iter.next();
    iter.next();
    iter.next_back();
    iter.next_back();
    inv_str = iter.as_str().to_owned();
    // println!("{}", inv_str);

    // now we can go item by item normally
    inv_str = inv_str
        .split("},{")
        .into_iter()
        .filter(|x| !x.contains(id.as_str()))
        .collect::<Vec<&str>>()
        .join("},{");
    // println!("'{}', {}", inv_str, inv_str.len());
    // if there are no items left we dont need the extra curly braces
    if inv_str != "" {
        inv_str.insert(0, '{');
        inv_str.insert(inv_str.len(), '}');
    }
    inv_str.insert(0, '[');
    inv_str.insert(inv_str.len(), ']');

    // println!("{}", inv_str);

    // TODO: custom error codes https://github.com/tauri-apps/tauri/discussions/6952
    if initial_inv == inv_str {
        return false;
    }
    let res = write_data(KEY.to_owned(), inv_str.to_owned());
    res
}

// so if im not using mobile, i dont have to have these here?
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_data,
            write_data,
            add_item,
            remove_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
