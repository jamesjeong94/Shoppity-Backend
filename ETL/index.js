const modulesETL = require('./modulesETL');

const startETL = () => {
  modulesETL.productETL().then((data) => {
    console.log(data);
    console.log('next in chain');
  });
};

startETL();
