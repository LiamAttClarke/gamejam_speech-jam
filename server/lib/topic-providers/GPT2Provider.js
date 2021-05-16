const axios = require('axios');
const { GPT2_URL } = require('../../constants');

module.exports = class GPT2Provider {
  async provide() {
    const { data } = await axios.post(GPT2_URL, {
      prefix: '',
      length: 50,
      temperature: 1,
      truncate: false,
      include_prefix: false,
    });
    return data.text;
  }
}
