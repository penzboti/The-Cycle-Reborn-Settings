const { invoke } = window.__TAURI__.core;
const { readTextFile } = window.__TAURI__.fs;

async function get_data(key) {
  let res = await invoke("get_data", { key });
  let json = await JSON.parse(res);
  return Promise.resolve(json);
}

async function write_data(key, value) {
  let res = await invoke("write_data", {
    key,
    value,
  });
  if (res === false) {
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
}

const items = await readTextFile("items.json", {
  baseDir: 11,
}).then((data) => {
  return JSON.parse(data);
});

export { get_data, write_data, items };
