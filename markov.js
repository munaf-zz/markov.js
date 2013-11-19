(function() {

  var SENTENCE_START = "<<SENTENCE_START>>";

  var Markov = function(options) {

    this.options = {
      inputText: options.inputText,      // The input corpus
      numWords: options.numWords || 100, // # words to generate
      endWithCompleteSentence: options.endWithCompleteSentence || false
    }

    this.dictionary = {};
    this._setup();

    return this;
  };

  Markov.prototype = {
    // Instantiate the Markov dictionary object and add a corpus
    _setup: function() {
      this.dictionary[SENTENCE_START] = [];
      this.dictionary['.']            = [SENTENCE_START];

      if (this.options.inputText) {
        this.addCorpus(this.options.inputText);
      }
    },

    // Get a random succeeding word from the dictionary
    _randomNextWord: function(word) {
      var nextWords = this.dictionary[word];
      return nextWords[Math.floor(Math.random()*nextWords.length)];
    },

    // Returns true if a word ends a sentence
    _endsSentence: function(word) {
      var lastChar = word.slice(-1);

      return (lastChar === '.' || lastChar === '?' || lastChar === '!');
    },

    // Strip text of illegal characters
    _cleanText: function(text) {
      text = text.replace(/^\s+|\s+$/g,""); // trim spaces first

      return text
        .replace(/[^a-zA-Z\s.,!?:;\']/g, "") // remove illegal chars
        .replace(/\s{2,}/g, " ");          // fix double spacing
    },

    _endsWithPunctuation: function(word) {
      var lastChar = word.slice(-1);

      return ".,?!;:".indexOf(lastChar) > -1;
    },

    _capitalizeWord: function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },

    // Add a single word to the dictionary
    _addWord: function(word, prevWord) {
      if (this.dictionary.hasOwnProperty(prevWord)) {
        if (word) this.dictionary[prevWord].push(word);
      } else if (word) {
        this.dictionary[prevWord] = [word];
      } else {
        this.dictionary[prevWord] = [];
      }
    },

    // Generates a number of words specified by the user
    generate: function(numWords) {
      var generatedText = "",
          currentWord = SENTENCE_START,
          nextWord, i = 0;

      while (i < numWords
              || (this.options.endWithCompleteSentence === true 
                  && !this._endsSentence(currentWord))) {

        nextWord = this._randomNextWord(currentWord);

        if (i >= numWords) {
          console.log("======");
          console.log("current: ", currentWord);
          console.log("next: ", nextWord)
        }

        if (this._endsWithPunctuation(nextWord)) {
          console.log("endsWithPunctuation");
          generatedText += nextWord;
        } else if (currentWord === SENTENCE_START) {
          console.log("current = SENTENCE_START");
          generatedText += ' ' + this._capitalizeWord(nextWord);
          i++;
        } else if (nextWord !== SENTENCE_START) {
          console.log("next != SENTENCE_START");
          generatedText += ' ' + nextWord;
          i++;
        }

        currentWord = nextWord;
      }

      return generatedText;
    },

    // Parses text and adds it to the Markov dictionary
    addCorpus: function(text) {
      text = this._cleanText(text); // Reformat text

      var self = this,
          tokens = text.split(' '),
          tokenBuffer = [],
          prevToken = SENTENCE_START,
          word;

      for (var i = 0; i < tokens.length; i++) {
        word = tokens[i].toLowerCase();

        if (this._endsSentence(prevToken)) {
          tokenBuffer.push(SENTENCE_START);
        }

        if (!this._endsWithPunctuation(word)) {
          tokenBuffer.push(word);
        } else {
          tokenBuffer.push(word.slice(0, word.length-1));
          tokenBuffer.push(tokens[i].slice(-1));
        }

        tokenBuffer.forEach(function(token, index) {
          var prev = (index > 0) ? tokenBuffer[index-1] : prevToken;
          self._addWord(token, prev);
        });

        prevToken = tokenBuffer[tokenBuffer.length-1];
        tokenBuffer = [];
      }

    } // addCorpus

  };

  window.Markov = Markov;

}).call(this);