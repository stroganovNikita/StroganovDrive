const { createClient } = require('@supabase/supabase-js');
const { decode } = require('base64-arraybuffer');
const fs = require('fs/promises');
require('dotenv').config();


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  fetch: fetch.bind(globalThis)
 });

exports.supabaseUploadFile = async (file, nickName) => {
  const { data, error } = await supabase.storage
  .from('test2')
  .upload(nickName + file.originalname) 
};

exports.supabaseDownloadFile = async (fileName, nickname) => {
  const { data, error } = await supabase.storage
  .from('test2')
  .download(nickname + fileName)
  
  const buffer = Buffer.from(await data.arrayBuffer());

  console.log(data, error)

  if (error) ;

  return buffer
}