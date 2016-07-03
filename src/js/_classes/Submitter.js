export default class  Submitter {

  constructor(you) {
    this.$you = $(you);
    this.$form = this.$you.closest('form');
    this.acti = this.$you.data('action');
    this.para = this.$you.data('parameter');
  }

  // <button type="button" class="btn center-block js-button-submit" data-action="http://gnavi.co.jp/" data-parameter='{"back":"true"}'>&laquo; 修正・前の画面へ</button>

  submitRobot() {
    if (typeof this.acti !== 'undefined') {
      this.$form.attr('action', this.acti);
    }
    if (typeof this.para !== 'undefined') {
      this.$form.attr('action', this.acti);
      let str = '';

      Object.keys(this.para).map(function(key,val) {
        str += `<input type="hidden" name="${key}" value="${val}">`;
      });

      this.$form.prepend(str);
    }
    this.$form.submit();
  }

  addClickEvent() {
    this.$you.on('click', (e) => {
      this.submitRobot();
      return false;
    });
  }

  init() {
    this.addClickEvent();
  }

}
