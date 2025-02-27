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
        condition: [
          {
            value: 300000,
            label: '전월 실적',
          },
          {
            value: 7000000,
            label: '전월 실적',
          },
        ],
        benefit: [
          {
            value: 10000,
            label: '혜택 1',
          },
          {
            value: 5000,
            label: '혜택 2',
          },
          {
            value: 3000,
            label: '혜택 3',
          },
          {
            value: 2000,
            label: '혜택 4',
          },
        ],
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
        condition: [
          {
            value: 300000,
            label: '전월 실적',
          },
          {
            value: 7000000,
            label: '전월 실적',
          },
        ],
        benefit: [
          {
            value: 10000,
            label: '혜택 1',
          },
          {
            value: 5000,
            label: '혜택 2',
          },
          {
            value: 3000,
            label: '혜택 3',
          },
          {
            value: 2000,
            label: '혜택 4',
          },
        ],
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
        condition: [
          {
            label: '전월 실적',
            value: 300000,
          },
          {
            label: '전월 실적',
            value: 7000000,
          },
        ],
        benefit: [
          {
            value: 10000,
            label: '혜택 1',
          },
          {
            value: 5000,
            label: '혜택 2',
          },
          {
            value: 3000,
            label: '혜택 3',
          },
          {
            value: 2000,
            label: '혜택 4',
          },
        ],
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
        condition: [
          {
            value: 300000,
            label: '전월 실적',
          },
          {
            value: 7000000,
            label: '전월 실적',
          },
        ],
        benefit: [
          {
            value: 10000,
            label: '혜택 1',
          },
          {
            value: 5000,
            label: '혜택 2',
          },
        ],
      },
    ],
  },
]

export default data
