exports = module.exports = function(prompt) {

  return [
    prompt()
  ];
};

exports['@require'] = [
  '../../middleware/prompt'
];
