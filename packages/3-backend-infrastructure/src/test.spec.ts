describe('test', () => {
  it('works', () => {
    // assert.equal(1 + 1, 2);
  });
});

// const setupDatabase = () => {
//   let isReady = false;

//   beforeEach(async () => {
//     isReady = false;
//     console.log('before reset');
//     await new Promise((r) => setTimeout(r, 100));
//     console.log('after reset');
//     isReady = true;
//   });

//   return async () => {
//     while (!isReady) {
//       await new Promise((r) => setTimeout(r, 10));
//     }
//   };
// };

// describe('test', () => {
//   const waitForDatabaseReady = setupDatabase();

//   beforeEach(async () => {
//     await waitForDatabaseReady();

//     console.log('before insert');
//     await new Promise((r) => setTimeout(r, 10));
//     console.log('after insert');
//   });

//   it('test', () => {
//     //
//   });
// });
