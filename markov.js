(function() {

  var SENTENCE_START = "##SENTENCE_START##",
      SENTENCE_END   = "##SENTENCE_END##";

  var Markov = function(options) {

    this.options = {
      inputText: options.inputText,      // The input corpus
      numWords: options.numWords || 100, // # words to generate
      endWithCompleteSentence: false     // end with complete sentence regardless of numWords
    }
    this._setup();

    return this;
  };

  Markov.prototype = {
    // Instantiate the Markov dictionary object and add a corpus
    _setup: function() {
      this.dictionary = {};
      this.dictionary[SENTENCE_START] = [];
      this.dictionary[SENTENCE_END]   = [SENTENCE_START];

      if (this.options.inputText) {
        this.addCorpus(this.options.inputText);
      }
    },

    // Get a random succeeding word from the dictionary
    _randomFollower: function(word) {
      var nextWords = this.dictionary[word];
      return nextWords[Math.floor(Math.random()*nextWords.length)];
    },

    // Clip the period from a word ending a sentence
    _removePeriod: function(word) {
      return word.replace(/\./g, '');
    },

    // Returns true if a word ends a sentence
    _isTerminating: function(word) {
      return (word.charAt(word.length-1) === '.');
    },

    // Generates a number of words specified by the user
    generate: function(numWords) {
      var generatedText = "",
          currentWord = SENTENCE_START,
          nextWord, i = 0;

      while (i < numWords || (this.options.endWithCompleteSentence === true 
              && currentWord !== SENTENCE_START)) {

        nextWord = this._randomFollower(currentWord);

        if (nextWord === SENTENCE_START) {
        } else if (nextWord === SENTENCE_END) {
          generatedText += '.';
        } else if (currentWord === SENTENCE_START) {
          generatedText += ' ' + nextWord.charAt(0).toUpperCase() + nextWord.slice(1);
          i++;
        } else {
          generatedText += ' ' + nextWord;
          i++;
        }

        currentWord = nextWord;
      }

      return generatedText;
    },

    // Parses text and adds it to the Markov dictionary
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
    } // addCorpus
  };

  window.Markov = Markov;

}).call(this);