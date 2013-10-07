(function() {

  var Markov = function(options) {

    this.options = {
      inputText: options.inputText,
      order: options.order || 2,
      numWords: options.numWords || 100
    }
    this._setup();

    return this;
  };

  Markov.prototype = {

    // Generate text.
    generate: function(numWords) {
      numWords = numWords || this.params.numWords;
      var outputText = '',
        words, word;

      this._resetPrefix();

      for (var i = 0; i < numWords; i++) {
        words = this.params.dictionary[this.params.prefix.join('#')];
        word = words[Math.floor(Math.random() * words.length)];

        if (word === ' ') break;

        outputText += word + (this.params.latinBased ? ' ' : '');

        this.params.prefix.shift();
        this.params.prefix.push(word);
      }
      return outputText;
    },

    // Add a corpus to the Markov chain. 
    addCorpus: function(corpusText) {
      if (!corpusText || corpusText.length === 0) {
        return;
      }

      corpusText = corpusText.replace(/#|"/g, '').replace(/\d+:\d+/g, '');
      corpusText = corpusText.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');

      this.params.corpusText += corpusText;
      this._resetCorpus();
      this._resetDictionary();
      this._addWord(' ');
    },

    // Set up the Markov object.
    _setup: function() {
      this.params = {
        order: this.options.order
      };

      this._resetPrefix();

      this.params.dictionary = {};
      this.params.corpus = [];
      this.params.corpusText = this.options.inputText || '';
      this.params.latinBased = true;

      if (this.params.corpusText) {
        this.addCorpus(this.params.corpusText);
        this._resetDictionary();
        this._addWord(' ');
      }
    },

    // Start a new Markov Prefix. 
    _resetPrefix: function() {
      this.params.prefix = [];
      for (var i = 0; i < this.params.order; i++) {
        this.params.prefix.push(' ');
      }
    },

    // Start a new corpus.
    _resetCorpus: function() {
      var numForeignChars = 0,
        corpusLength = this.params.corpusText.length;

      this.params.corpus = [];

      for (var i = 0; i < corpusLength; i++) {
        if (this.params.corpusText.charCodeAt(i) > 255) {
          numForeignChars++;
        }
      }

      // Determine if Latin-based corpus.
      // Not exactly scientific, I know.
      if (numForeignChars >= corpusLength / 3) {
        this.params.latinBased = false;
        this.params.corpus = this.params.corpusText.replace(/\s+/g, '').split('');
      } else {
        this.params.latinBased = true;
        this.params.corpus = this.params.corpusText.split(' ');
      }
    },

    // Start a new dictionary.
    _resetDictionary: function() {
      for (var i = 0; i < this.params.corpus.length; i++) {
        this._addWord(this.params.corpus[i]);
      }
    },

    // Add a single word to the dictionary.
    _addWord: function(word) {
      var key = this.params.prefix.join('#');

      if (this.params.dictionary[key] === null || this.params.dictionary[key] === undefined) {
        this.params.dictionary[key] = [];
      }

      this.params.dictionary[key].push(word);
      this.params.prefix.shift();
      this.params.prefix.push(word);
    }
  };

  window.Markov = Markov;

}).call(this);