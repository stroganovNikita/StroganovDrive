const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  fetch: fetch.bind(globalThis)
 });

exports.supabaseUploadFile = async (file, nickname) => {
  const { data, error } = await supabase.storage
  .from('test2')
  .upload(nickname + file.originalname, file.buffer) 
  
};

exports.supabaseDownloadFile = async (fileName, nickname) => {
  const { data, error } = await supabase.storage
  .from('test2')
  .download(nickname + fileName)
  
  const buffer = Buffer.from(await data.arrayBuffer());

  if (error) return error;

  return buffer
};

exports.supabaseDeleteFile = async (fileName, nickname) => {
 const { data, error } = await supabase.storage
 .from('test2')
 .remove([nickname + fileName])

}
