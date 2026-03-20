const inputTexts = {
  users: {
    firstName: {
      tests: 'E2E',
      demo: 'Tyrion',
    },
    lastNamePrefix: {
      tests: 'User',
      demo: 'Lannister',
    },
    usernamePrefix: {
      tests: 'e2e',
      demo: 'tyrion',
    },
    passwordPrefix: 'Pass!',
  },
  entities: {
    statusPrefix: {
      tests: 'status',
      demo: 'In Progress',
    },
    labelPrefix: {
      tests: 'label',
      demo: 'Important',
    },
    taskPrefix: {
      tests: 'task',
      demo: 'Prepare report',
    },
  },
  taskDescriptions: {
    tests: {
      created: 'e2e description',
      updated: 'updated description',
      firstDuplicateCheck: 'first task',
      secondDuplicateCheck: 'duplicate task',
      linked: 'linked task',
      authorOwned: 'author task',
    },
    demo: {
      createdScreenshot: 'Demo task',
      updatedScreenshot: 'Demo task updated',
      duplicateScreenshot: 'Duplicate task',
      createdVideo: 'Demo full flow',
      updatedVideo: 'Demo updated flow',
      duplicateVideo: 'Duplicate name demo',
    },
  },
} as const;

export default inputTexts;
