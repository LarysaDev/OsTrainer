using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace AlgorithmsTests
{
    //[TestClass]
    //public class PageReplacementTests
    //{
    //    [TestMethod]
    //    public void GenerateFifoMatrix_ShouldReturnCorrectMatrixAndPageFaults()
    //    {
    //        // Arrange
    //        var service = new PageReplacementService();
    //        {
    //            FrameCount = 3,
    //            PageRequests = new int[] { 1, 2, 3, 4, 2, 3, 1, 4, 5 }
    //        };

    //        var expectedMatrix = new List<List<int>>
    //    {
    //        new List<int> {  1,  1,  1,  4,  4,  4,  1,  1,  5 },
    //        new List<int> { -1,  2,  2,  2,  2,  3,  3,  3,  3 },
    //        new List<int> { -1, -1,  3,  3,  3,  3,  1,  4,  4 }
    //    };

    //        var expectedPageFaults = new List<bool> { true, true, true, true, false, false, true, false, true };

    //        // Act
    //        var result = service.GenerateFifoMatrix(request);

    //        // Assert
    //        Assert.Equal(expectedMatrix.Count, result.Matrix.Count);
    //        for (int row = 0; row < expectedMatrix.Count; row++)
    //        {
    //            Assert.Equal(expectedMatrix[row], result.Matrix[row]);
    //        }

    //        Assert.Equal(expectedPageFaults, result.PageFaults);
    //    }
    //}
}
