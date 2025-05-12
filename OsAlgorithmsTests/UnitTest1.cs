using OsTrainer.Server.Services.PageReplacement;

namespace OsAlgorithmsTests
{
    public class PageReplacementTests
    {
        [Fact]
        public void GenerateFifoMatrix_ShouldReturnCorrectMatrixAndPageFaults()
        {
            // Arrange
            var service = new PageReplacementService();
            var request = new PageReplacementRequest
            {
                FrameCount = 3,
                PageRequests = new int[] { 3, 2, 1, 0, 3, 2, 4, 3, 2, 1, 0, 4 }
            };

            var expectedMatrix = new List<List<int>>
            {
                new List<int> {  3,  3,  3,  0,  0,  0,  4,  4,  4, 4, 4, 4 },
                new List<int> { -1,  2,  2,  2,  3,  3,  3,  3,  3, 1, 1, 1},
                new List<int> { -1, -1,  1,  1,  1,  2,  2,  2,  2, 2, 0, 0}
            };

            var expectedPageFaults = new List<bool> { true, true, true, true, true, true, true, false, false, true, true, false };

            // Act
            var result = service.GenerateFifoMatrix(request);

            // Assert
            Assert.Equal(expectedMatrix.Count, result.Matrix.Count);
            AssertMatricesEqual(expectedMatrix, result.Matrix);
            Assert.Equal(expectedPageFaults, result.PageFaults);
        }

        private void AssertMatricesEqual(List<List<int>> expected, List<List<int>> actual)
        {
            Assert.Equal(expected.Count, actual.Count);
            for (int row = 0; row < expected.Count; row++)
            {
                Assert.Equal(expected[row].Count, actual[row].Count);
                for (int col = 0; col < expected[row].Count; col++)
                {
                    Assert.Equal(expected[row][col], actual[row][col]);
                }
            }
        }
    }
}