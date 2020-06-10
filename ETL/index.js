const modulesETL = require('./modulesETL');

const startETL = () => {
  const totalTimeResults = [];
  modulesETL
    .productETL()
    .then((data) => {
      totalTimeResults.push(data);
      return modulesETL.stylesETL();
    })
    .then((data) => {
      totalTimeResults.push(data);
      return modulesETL.photosETL();
    })
    .then((data) => {
      totalTimeResults.push(data);
      return modulesETL.relatedETL();
    })
    .then((data) => {
      totalTimeResults.push(data);
      return modulesETL.featuresETL();
    })
    .then((data) => {
      totalTimeResults.push(data);
      return modulesETL.skusETL();
    })
    .then((data) => {
      totalTimeResults.push(data);
      modulesETL.toStylesETL('photos');
      modulesETL.toStylesETL('skus');
      console.log(totalTimeResults);
    })
    .catch((err) => {
      console.log(err);
    });
};

startETL();
