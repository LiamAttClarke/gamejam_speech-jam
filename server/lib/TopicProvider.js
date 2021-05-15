const axios = require('axios');
const gpt = require('./gpt');

const topics = {
  SPEECHJAM : 'https://speechjam-gpt2-43ucqvtxja-nn.a.run.app',
  WIKI : 'https://en.wikipedia.org/api/rest_v1/page/random/summary'
};

module.exports = class TopicProvider {
  //Generates a topic string
  //Usage: give a topic number 0-1
  async generateTopic(topic=null) {
    let endpoint;
    if(topic==null) topic=Math.floor(Math.random() * Object.keys(topics).length);
    switch (topic) {
      case 0:
        endpoint = this.speechjam;
        break;
      case 1:
        endpoint = this.wikipedia;
        break;
      default:
        endpoint = this.wikipedia;
        break;
    }
    return await endpoint();
  }

  async speechjam(){
    let response = new gpt();
    console.log('Topic is from GPT');
    return response.generateMessage('',100);
  }

  async wikipedia(){
    const {data} = await axios.get(topics.WIKI);
    console.log('Topic is from Wikipedia');
    console.log(data.extract);
    return data.extract;
  }

  //Todo
  async lyrics(){
    const response = await axios.post(topics.SPEECHJAM, {
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
