use lazy_static::lazy_static;
use mongodb::{
    bson::{doc, Document},
    sync::{Client, Collection, Database},
};

const URI: &str = "mongodb://localhost:27017";
lazy_static! {
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
fn get_item_list() -> String {
    std::fs::read_to_string("../collect/result/items.json").unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_data,
            write_data,
            get_item_list
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
