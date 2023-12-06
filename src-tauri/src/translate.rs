use google_translator::{translate, InputLang};

#[tauri::command]
pub async fn google_translate(value: Vec<String>, output_lang: String) -> Vec<String> {
    match translate(value.clone(), InputLang::SimplifiedChinese, output_lang).await {
        Ok(result) => result
            .output_text
            .into_iter()
            .map(|v| v[0].clone())
            .collect(),
        Err(err) => {
            eprintln!("{err:?}");
            value
        }
    }
}
