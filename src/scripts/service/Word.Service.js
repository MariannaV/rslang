import { requestCreator } from '../../utils/requests';
import { store } from '../../store';
import { getRandomNumber } from '../helpers/getRandomNumber';

export class WordService {
  constructor() {
    this._words = [];
    this._level = 0;
    this._page = 0;
  }

  get words() {
    return this._words;
  }

  set words(words) {
    this._words = words;
  }

  get level() {
    return this._level;
  }

  set level(level) {
    this._level = level;
  }

  get page() {
    return this._page;
  }

  set page(page) {
    this._page = page;
  }

  static async getNewWords(wordsPerPage = 50) {
    const words = await requestCreator({
      url: `/users/${store.user.auth.userId}/aggregatedWords/?wordsPerPage=${wordsPerPage}&filter={"userWord":null}`,
      method: requestCreator.methods.get,
    });
    return words[0].paginatedResults;
  }

  static async getWordsByLevelAndPage(level = 0, page = 0) {
    this.level = level;
    this.page = page;
    this.words = [];
    const words = await requestCreator({
      url: `/words?page=${page}&group=${level}`,
      method: requestCreator.methods.get,
    });
    this.words.push(words);
    return words;
  }

  static async getMoreWordsByLevelAndPage() {
    this.page += 1;
    let newWords = await requestCreator({
      url: `/words?page=${this.page}&group=${this.level}`,
      method: requestCreator.methods.get,
    });
    if (!newWords.length) {
      this.level += 1;
      this.page = 0;
      newWords = await requestCreator({
        url: `/words?page=${this.page}&group=${this.level}`,
        method: requestCreator.methods.get,
      });
      if (!newWords.length) {
        this.level = 0;
        this.page = 0;
        newWords = await requestCreator({
          url: `/words?page=${this.page}&group=${this.level}`,
          method: requestCreator.methods.get,
        });
      }
    }
    this.words.push(newWords);
    return newWords;
  }

  static async getAllUserWords() {
    const words = await requestCreator({
      url: `/users/${store.user.auth.userId}/words`,
      method: requestCreator.methods.get,
    });
    return words;
  }

  static async getUserWord(wordId) {
    const word = await requestCreator({
      url: `/users/${store.user.auth.userId}/words/${wordId}`,
      method: requestCreator.methods.get,
    });
    return word;
  }

  static async createUserWord(
    wordId,
    text,
    difficulty,
    category,
    lastDayRepeat,
    nextDayRepeat,
    mistakeCount = 0,
    progressCount = 0
  ) {
    const word = {
      difficulty, // weak, hard, normal, easy
      optional: {
        word: text,
        category, // learned, deleted, difficult
        lastDayRepeat,
        nextDayRepeat,
        mistakeCount,
        progressCount, // if mistake -1, if correct +1, >= 0
      },
    };
    const result = await requestCreator({
      url: `/users/${store.user.auth.userId}/words/${wordId}`,
      method: requestCreator.methods.post,
      data: word,
    });
    console.log(result);
    return result;
  }

  static async updateUserWord(wordId, difficulty, updatedFields) {
    const word = await this.getUserWord(wordId);
    const { optional } = word;
    const result = await requestCreator({
      url: `/users/${store.user.auth.userId}/words/${wordId}`,
      method: requestCreator.methods.put,
      data: {
        difficulty,
        optional: {
          ...optional,
          ...updatedFields,
        },
      },
    });
    console.log(result);
    return result;
  }

  static async getAllAggregatedWords() {
    const words = await requestCreator({
      url: `/users/${store.user.auth.userId}/aggregatedWords`,
      method: requestCreator.methods.get,
    });
    return words;
  }

  static async getAggregatedWord(wordId) {
    const word = await requestCreator({
      url: `/users/${store.user.auth.userId}/aggregatedWords/${wordId}`,
      method: requestCreator.methods.get,
    });
    return word[0];
  }

  static async getWordsByCategory(category, wordsPerPage = 50) {
    const words = await requestCreator({
      url: `/users/${store.user.auth.userId}/aggregatedWords/?wordsPerPage=${wordsPerPage}&filter={"userWord.optional.category":"${category}"}`,
      method: requestCreator.methods.get,
    });
    return words[0].paginatedResults;
  }

  static async getWordsForGames(wordsNumber = 10, additionalFilter = null) {
    const filter = additionalFilter ?
    `{"$and":[{"userWord":{"$ne":null}, "userWord.optional.category":{"$ne":"deleted"}, ${additionalFilter}}]}`:
    '{"$and":[{"userWord":{"$ne":null}, "userWord.optional.category":{"$ne":"deleted"}}]}';
    const word = await requestCreator({
      url: `/users/${store.user.auth.userId}/aggregatedWords/?&wordsPerPage=${1}&page=${0}&filter=${filter}`,
      method: requestCreator.methods.get,
    });
    const wordsCount = word[0].totalCount[0].count;
    if (wordsCount < wordsNumber) {
      return 'not enough words'
    }
    const wordsForGame = [];
    const pages = [];
    do {
      const page = getRandomNumber(wordsCount);
      if (!pages.includes(page)) {
        pages.push(page);
      }
    } while (pages.length < wordsNumber);
    await Promise.all(pages.map(async (page) => {
      const randomWord = await requestCreator({
        url: `/users/${store.user.auth.userId}/aggregatedWords/?wordsPerPage=${1}&page=${page}&filter=${filter}`,
        method: requestCreator.methods.get,
      });
      wordsForGame.push(randomWord[0].paginatedResults[0]);
    }));
    console.log(wordsForGame);
    return wordsForGame;
  }

}
