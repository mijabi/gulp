import $ from 'NODE_MODULES/jquery/dist/jquery';

import Checker from 'CLASSES/Checker';
import Submitter from 'CLASSES/Submitter';

window.jQuery = window.$ = $;

const pulp = window.pulp = window.pulp || {};

{

  const ce = pulp.ce || {};
  ce.Checker = Checker;
  ce.Submitter = Submitter;

  // ce.somothing = function() {
  // };
  //
  // ce.init = function() {
  //   this.something();
  // }
  //
  // ce.init();

  pulp.ce = ce;

}


const checkerB = new pulp.ce.Checker('.js-checker--b', '.js-copier--b', '.js-container--b', 'b');
checkerB.init();
const checkerC = new pulp.ce.Checker('.js-checker--c', '.js-copier--c', '.js-container--c', 'c');
checkerC.init();
const checkerD = new pulp.ce.Checker('.js-checker--d', '.js-copier--d', '.js-container--d', 'd');
checkerD.init();

const submitter = new pulp.ce.Submitter('.js-button-submit');
submitter.init();
