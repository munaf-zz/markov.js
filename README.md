# Markov.js
This is a toy JavaScript library that uses [Markov Chains](https://en.wikipedia.org/wiki/Markov_chain) for text generation. I was inspired to do this while working on [Designer Ipsum](http://www.designeripsum.com). The implementation is not at all efficient, so I wouldn't rely on it for something critical (but why would you?).
## Usage
### Include
```html
<script language="text/javascript" src="markov.js"></script>
```
### Instantiate
```javascript
var markov = new Markov();
markov.addCorpus("Four score and seven..."); // add a training corpus
markov.addCorpus("I'm a lumberjack and..."); // add another...
```
Alternatively, you can instantiate it with a corpus.
```javascript
var markov = new Markov({
  inputText: "Four score and seven..."
});
```
### Generate
```javascript
var text = markov.generate(100); // generate 200 words
```
If you supply the [Gettysburg Address](http://en.wikipedia.org/wiki/Gettysburg_Address) as a corpus, here is one possible value of `text`:
```
It is altogether fitting and proper that cause for which they did here have a final resting place for the world will little note nor long endure. It can not dedicate we can long remember what we are engaged in a larger sense we should do this nation under god shall have thus far above our poor power to the proposition that nation so conceived and dedicated here have consecrated it is rather to the unfinished work which they who here. The earth. We here have a portion of devotion that these honored dead
```
### Additional Options
If you always want to make sure your text ends with a complete sentence (rather than right in the middle) just set `endWithCompleteSentence` to `true` when instantiating the object. By default, this option is set to `false`.
```javascript
var markov = new Markov({
  endWithCompleteSentence: true
});
```
## License
MIT.
