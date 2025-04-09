import {createTrans} from "@ktfun/sts-i18n-react";

const tranMap = {
  "zh": {
    "app": {
      "title": "生成图片",
      "desc": "使用 gpt-4o 生成图片",
      "gallery": "样例",
      "faq": "常见问题",
      "tools": "工具"
    }
  },
  "en": {
    "app": {
      "title": "Generate Image",
      "desc": "Generate image with gpt-4o",
      "gallery": "Gallery",
      "faq": "FAQ",
      "tools": "Tools"
    }
  }
}

export const {localeCtx, LocaleProvider, useLocale, useTrans} = createTrans(tranMap)
