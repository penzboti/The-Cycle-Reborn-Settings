use mongodb::{
    bson::{doc, Document},
    sync::{Client, Collection, Database},
};
// use serde_json::{from_str, to_string, Map, Value};

const URI: &str = "mongodb://localhost:27017";
lazy_static::lazy_static! {
    // hopefully editing entries is possible like this
    static ref client: Client = Client::with_uri_str(URI).unwrap();
    static ref database: Database = client.database("ProspectDb");
    static ref settings: Collection<Document> = database.collection("PlayFabUserData");
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_data(key: String) -> String {
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
    println!("{}", json);
    const KEY: &str = "Inventory";
    let mut inv_str = get_data(KEY.to_owned());
    println!("{}", inv_str);

    let id: String = uuid::Uuid::new_v4().as_u128().to_string();
    println!("{}", id);
    json = json.replace("UUIDV4", format!("TCRS{}", id.as_str()).as_str());
    println!("{}", json);

    let checkchar: char = inv_str.chars().nth(1).unwrap();
    if checkchar == '{' {
        inv_str.insert(1, ',');
    }
    for c in json.chars().rev() {
        inv_str.insert(1, c);
    }

    println!("{}", inv_str);
    let res = write_data(KEY.to_owned(), inv_str.to_owned());
    (res, id)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_data, write_data, add_item])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
