const tf = require ('@tensorflow/tfjs-node');

const MODEL_URL = __dirname+'/model/model.json';
const TEST_VALUE = 950.0;

class GPT2 {
  constructor(id, options = {}) {

  }

  //Give GPT2 some context
  setContext() {

  }

  //Generate a message
  generateMessage() {

  }

  //Empty out and refresh
  reset(){

  }


}

async function run() {
  const model = await tf.loadGraphModel('file://'+MODEL_URL);

  // Print out the architecture of the loaded model.
  // This is useful to see that it matches what we built in Python.
  //console.log(model.summary());

  try{
    const values = model.execute();
    //const values = model.execute({'input_1:0':'aaaaaa','input_2:0':'aa'},['Identity_1:0','Identity:0']);
  }catch(error){
    console.log(error);
    return "error prediction"
  }

  // Create a 1 dimensional tensor with our test value.
  //const input = tf.tensor1d(['pizza is gool']);

  // Actually make the prediction.
  //console.log(model.execute())
  //const result = model.predict(input);

  // Grab the result of prediction using dataSync method
  // which ensures we do this synchronously.
  //status.innerText = 'Input of ' + TEST_VALUE + 'sqft predicted as $' + result.dataSync()[0];
}

run();

module.exports = {
  GPT2,
};

