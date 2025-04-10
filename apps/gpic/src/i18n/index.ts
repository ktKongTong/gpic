import {createTrans} from "@ktfun/sts-i18n-react";

const en = {
  'components': {
    'uploader': {
      'tip': 'Click to upload or drag & drop image here'
    }
  },
  'pages': {
    'home': {
      'label': {
        'upload': "Upload Images",
        "flavor": "Styles",
        'size': "Size",
      }
    }
  }
} as const

const zh = {
  'components': {
    'uploader': {
      'tip': '点击上传或拖拽图片到这里'
    }
  },
  'pages': {
    'home': {
      'label': {
        'upload': "上传图片",
        "style": "风格",
        'size': "尺寸",
      }
    }
  }
}

const tranMap = {
  "zh": {
    'components': {
      'uploader': {
        'tip': 'Click to upload or drag & drop image here'
      }
    },
    'pages': {
      'home': {
        'label': {
          'upload': "Upload Images",
          "style": "Styles",
          'size': "Size",
        },
        'button': {
          'batch': 'Batch',
          'draw': 'Draw'
        }
      }
    }
  },
  "en": {
    'components': {
      'uploader': {
        'tip': 'Click to upload or drag & drop image here'
      }
    },
    'pages': {
      'home': {
        'label': {
          'upload': "Upload Images",
          "style": "Style",
          'size': "Size",
        },
        'button': {
          'batch': 'Batch',
          'draw': 'Draw'
        }
      }
    }
  }
} as const

export const {localeCtx, LocaleProvider, useLocale, useTrans} = createTrans(tranMap)
