export default class Checker {

  constructor(checker, copier, container, type) {
    this.$check = $(checker);
    this.$copier = $(copier);
    this.$container = $(container);
    this.myType = type;
  }

  changeOptionStatusOfAllMatchedOptions(bool) {
    if (bool) {
      $('.js-copier').val('a').find(`option[value="${this.myType}"]`).removeAttr('disabled');
    } else {
      $('.js-copier').val('a').find(`option[value="${this.myType}"]`).attr('disabled', 'disabled');
    }
  }

  statusCheck() {
    if (this.$check.filter(':checked').val() !== '') {
      this.$container.slideUp(256).find(':input').attr('disabled', 'disabled');
      this.changeOptionStatusOfAllMatchedOptions(false);
    } else {
      this.$container.slideDown(256).find(':input').removeAttr('disabled');
      this.changeOptionStatusOfAllMatchedOptions(true);
    }
  }

  addClickEvent() {
    this.$check.on('change', (e) => {
      this.statusCheck();
    });
  }

  init() {
    this.addClickEvent();
    if (this.$check.filter(':checked').val() !== '') {
      this.statusCheck();
    }
    // alert('hoge');
  }

}
