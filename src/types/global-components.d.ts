import UniPopup from '@/components/uni-popup/uni-popup.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    UniPopup: typeof UniPopup;
  }
}