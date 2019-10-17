import Vue from 'vue';
import SComponents from '../components/common';

SComponents.forEach((component) => {
  Vue.component(component.name, component);
});
