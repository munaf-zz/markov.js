# Markov.js
This is a toy JavaScript library that uses [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain) for text generation. I was inspired to do this while working on [Designer Ipsum](http://www.designeripsum.com). The implementation is not at all efficient, so I wouldn't rely on it for something critical (but why would you?).
## Usage
Include the library.
```html
<script language="text/javascript" src="markov.js"></script>
```
Instantiate a Markov object and add a corpus (or more). 
```javascript
var markov = new Markov();
markov.addCorpus("Four score and seven...");
markov.addCorpus("I'm a lumberjack and...");
```
Alternatively, you can instantiate it with a corpus.
```javascript
var markov = new Markov({
  inputText: "Four score and seven..."
});
```
Now, you're ready to generate text. 
```javascript
var text = markov.generate(200); // generate 200 words
```
If you always want to make sure your text ends with a complete sentence (rather than right in the middle) just set `endWithCompleteSentence` to `true` when instantiating the object. By default, this option is set to `false`.
```javascript
var markov = new Markov({
  endWithCompleteSentence: true
});
```
## License
MIT.
