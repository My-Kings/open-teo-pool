import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import $ from 'jquery';
import config from '../config/environment';

export default Controller.extend({
  intl: inject(),
  get config() {
    return config.APP;
  },

  height: computed('model.nodes', {
    get() {
      let node = this.get('bestNode');
      if (node) {
        return node.height;
      }
      return 0;
    }
  }),

  roundShares: computed('model.stats', {
    get() {
      return parseInt(this.get('model.stats.roundShares'));
    }
  }),

  difficulty: computed('model.nodes', {
    get() {
      let node = this.get('bestNode');
      if (node) {
        return node.difficulty;
      }
      return 0;
    }
  }),

  blockTime: computed('model.nodes', {
    get() {
      var node = this.get('bestNode');
      if (node && node.blocktime) {
        return node.blocktime;
      }
      return config.APP.BlockTime;
    }
  }),

  blockReward: computed('model', {
    get() {
      var blockReward = this.get('model.blockReward');
      blockReward = blockReward * 1e-18;
      return blockReward;
    }
  }),

  hashrate: computed('difficulty', {
    get() {
      var blockTime = this.get('blockTime');
      return this.getWithDefault('difficulty', 0) / blockTime;
    }
  }),

  immatureTotal: computed('model', {
    get() {
      return this.getWithDefault('model.immatureTotal', 0) + this.getWithDefault('model.candidatesTotal', 0);
    }
  }),

  bestNode: computed('model.nodes', {
    get() {
      let node = null;
      this.get('model.nodes').forEach(function (n) {
        if (!node) {
          node = n;
        }
        if (node.height < n.height) {
          node = n;
        }
      });
      return node;
    }
  }),

  lastBlockFound: computed('model', {
    get() {
      return parseInt(this.get('model.lastBlockFound')) || 0;
    }
  }),

  languages: computed('model', {
    get() {
      return this.get('model.languages');
    }
  }),

  selectedLanguage: computed({
    get() {
      var langs = this.get('languages');
      var lang = $.cookie('lang');
      for (var i = 0; i < langs.length; i++) {
        if (langs[i].value == lang) {
          return langs[i].name;
        }
      }
      return lang;
    }
  }),

  currencies: computed('model', {
    get() {
      return config.APP.currencies;
    }
  }),

  selectedCurrency: computed({
    get() {
      var currencies = this.get('currencies');
      var currency = $.cookie('currency');
      for (var i = 0; i < currencies.length; i++) {
        if (currencies[i].value === currency) {
          return currencies[i].name;
        }
      }
      return currency;
    }
  }),

  roundVariance: computed('model', {
    get() {
      let percent = this.get('model.stats.roundShares') / this.get('difficulty');
      if (!percent) {
        return 0;
      }
      return percent.toFixed(2);
    }
  }),

  nextEpoch: computed('height', {
    get() {
      let epochOffset = (30000 - (this.getWithDefault('height', 1) % 30000)) * 1000 * this.get('config').BlockTime;
      return Date.now() + epochOffset;
    }
  })
});
