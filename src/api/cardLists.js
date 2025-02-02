const data = [
  {
    code: '0000',
    label: '카드회사1',
    cards: [
      {
        value: '001',
        label: '예시카드 01',
        type: [
          {
            value: 20000,
            label: '국내 12',
          },
          {
            value: 25000,
            label: '해외 123',
          },
        ],
        condition: {
          con_01: {
            label: '전월 실적',
            value: 300000,
          },
          con_02: {
            label: '전월 실적',
            value: 7000000,
          },
        },
        benefit: {
          ben_01: {
            label: '혜택 1',
            value: 10000,
          },
          ben_02: {
            label: '혜택 2',
            value: 5000,
          },
          ben_03: {
            label: '혜택 3',
            value: 3000,
          },
          ben_04: {
            label: '혜택 4',
            value: 2000,
          },
        },
      },
      {
        value: '002',
        label: '예시카드 02 (국내전용)',
        type: [
          {
            value: 10000,
            label: '국내',
          },
        ],
        condition: {
          con_01: {
            label: '전월 실적',
            value: 300000,
          },
          con_02: {
            label: '전월 실적',
            value: 7000000,
          },
        },
        benefit: {
          ben_01: {
            label: '혜택 1',
            value: 10000,
          },
          ben_02: {
            label: '혜택 2',
            value: 5000,
          },
          ben_03: {
            label: '혜택 3',
            value: 3000,
          },
          ben_04: {
            label: '혜택 4',
            value: 2000,
          },
        },
      },
    ],
  },
  {
    code: '0001',
    label: '카드회사2',
    cards: [
      {
        value: '001',
        label: '예시카드 01',
        type: [
          {
            value: 20000,
            label: '국내',
          },
          {
            value: 25000,
            label: '해외',
          },
        ],
        condition: {
          con_01: {
            label: '전월 실적',
            value: 300000,
          },
          con_02: {
            label: '전월 실적',
            value: 7000000,
          },
        },
        benefit: {
          ben_01: {
            label: '혜택 1',
            value: 10000,
          },
          ben_02: {
            label: '혜택 2',
            value: 5000,
          },
          ben_03: {
            label: '혜택 3',
            value: 3000,
          },
          ben_04: {
            label: '혜택 4',
            value: 2000,
          },
        },
      },
      {
        value: '002',
        label: '예시카드 02 (국내전용)',
        type: [
          {
            value: 10000,
            label: '국내',
          },
        ],
        condition: {
          con_01: {
            label: '전월 실적',
            value: 300000,
          },
          con_02: {
            label: '전월 실적',
            value: 7000000,
          },
        },
        benefit: {
          ben_01: {
            label: '혜택 1',
            value: 10000,
          },
          ben_02: {
            label: '혜택 2',
            value: 5000,
          },
        },
      },
    ],
  },
]

export default data
