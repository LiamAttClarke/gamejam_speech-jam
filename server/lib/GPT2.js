const axios = require('axios');

const SPEECHJAM_ENDPOINT = 'https://speechjam-gpt2-43ucqvtxja-nn.a.run.app';

module.exports = class GPT {
  //wake up the server
  //Usage:
  //gpt.awake();
  async awake(){
    const response = await axios.get(SPEECHJAM_ENDPOINT+'/awake');
    return response;
  }

  //Generate a GPT2 message
  //Usage:
  //const gpt = new GPT();
  //gpt.generateMessage('apples',100);

  async generateMessage(prefix='', length=25, temperature=0.7, include_prefix=false) {
    const response = await axios.post(SPEECHJAM_ENDPOINT, {
      "prefix": prefix,
      "length": length<250?length:250, //cap the length
      "temperature": temperature,
      //"truncate": false, //defunct
      //"include_prefix": include_prefix //defunct
    });
    //Remove Prefix
    const cleaned = String(response.data.text).replace(prefix,'').trim();
    //Remove new lines
    cleaned.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g,' ')
    //Remove <|endoftext|>
    cleaned.replace('<|endoftext|>',' ')
    console.log(cleaned);

    return cleaned;
  }
}
