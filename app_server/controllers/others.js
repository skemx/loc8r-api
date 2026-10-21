/* GET About page */
const about = (req, res) => {
  res.render('generic-text', {
    title: 'About Loc8r - 2022810050 이선규',

    content:
      'Loc8r was created to help people find places to sit down ' +
      'and get a bit of work done.<br/><br/>' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Nunc sed lorem ac nisi dignissim accumsan. ' +
      'Nullam sit amet interdum magna. ' +
      'Morbi quis faucibus nisi.'
  });
};

module.exports = {
  about
};