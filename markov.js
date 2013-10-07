(function() {

  var SENTENCE_START = "##SENTENCE_START##",
      SENTENCE_END   = "##SENTENCE_END##";

  var Markov = function(options) {

    this.options = {
      inputText: options.inputText,      // The input corpus
      order: options.order || 2,         
      numWords: options.numWords || 100, // # words to generate
      endWithPeriod: true                // end with period even if not end of sentence
    }
    this._setup();

    return this;
  };

  Markov.prototype = {

    // Generate text.
    _generate: function(numWords) {
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
    _addCorpus: function(corpusText) {
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
      this.dictionary = {};
      this.dictionary[SENTENCE_START] = [];
      this.dictionary[SENTENCE_END]   = [SENTENCE_START];

      if (this.options.inputText) {
        this.addCorpus(this.options.inputText);
      }
    },

    generate: function(numWords) {
      console.log(this.dictionary);
      var generatedText = "",
          currentWord = SENTENCE_START,
          followingWord, i = 0;

      while (i < numWords) {
        followingWord = this._randomFollower(currentWord);

        if (followingWord === SENTENCE_START) {
        } else if (followingWord === SENTENCE_END) {
          generatedText += '.';
        } else if (currentWord === SENTENCE_START) {
          generatedText += ' ' + followingWord.charAt(0).toUpperCase() + followingWord.slice(1);
        } else {
          generatedText += ' ' + followingWord;
        }

        i++;
        currentWord = followingWord;
      }

      if (this.options.endWithPeriod === true) {
        if (generatedText.charAt(generatedText.length-1) !== '.') {
          generatedText += '.';
        }
      }

      return generatedText;
    },

    _randomFollower: function(word) {
      var followingWords = this.dictionary[word];
      console.log('## ' + word, followingWords);
      console.log('>> ' + Math.floor(Math.random(followingWords.length)));
      return followingWords[Math.floor(Math.random()*followingWords.length)];
    },

    addCorpus: function(text) {
      text = text
        .replace(/[-,—?!]/g, "")  // remove punctuation for now
        .replace(/\s{2,}/g, ' '); // fix double spacing caused by above

      var tokens = text.split(' '); // Tokenize
      var currentToken, followingToken, terminating;

      for (var i = 0; i < tokens.length; i++) {
        currentToken = tokens[i]
          .toLowerCase()
          .replace(/^\s+|\s+$/g,""); // trim spaces

        if (i !== (tokens.length-1)) {
          followingToken = tokens[i+1].toLowerCase();
        }

        // If word ends a sentence, don't include periods in the lookup
        terminating = false;
        if (this._isTerminating(currentToken)) {
          currentToken = this._removePeriod(currentToken);
          terminating = true;
        }

        // First time the word is encountered
        if (!this.dictionary[currentToken]) {
          this.dictionary[currentToken] = [];
        }

        // Word ends a sentence
        if (terminating === true) {
          this.dictionary[currentToken].push(SENTENCE_END);
        } else {
          this.dictionary[currentToken].push(this._removePeriod(followingToken));
        }

        // Word starts a sentence
        if (i === 0 || this._isTerminating(tokens[i-1])) {
          this.dictionary[SENTENCE_START].push(currentToken);
        }
      }
    },

    _removePeriod: function(word) {
      return word.replace(/\./g, '');
    },

    _isTerminating: function(word) {
      return (word.charAt(word.length-1) === '.');
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