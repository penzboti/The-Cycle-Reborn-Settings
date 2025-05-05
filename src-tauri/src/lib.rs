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
fn get_data(data: String) -> String {
    let inventory = settings
        .find_one(doc! { "Key": data })
        .run()
        .unwrap()
        .unwrap();
    let inv = inventory.get("Value").unwrap().as_str().unwrap();
    inv.to_owned()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
