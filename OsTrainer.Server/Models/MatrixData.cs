namespace OsTrainer.Server.Models
{
    public class MatrixData
    {
        public object?[][] CorrectMatrix { get; set; }
        public object?[][] UserMatrix { get; set; }
    }

    public class SchedulingMatrixData
    {
        public string?[][] CorrectMatrix { get; set; }
        public int[][] UserMatrix { get; set; }
    }

    public class PageReplacementMatrixData
    {
        public object?[][] CorrectMatrix { get; set; }
        public object?[][] UserMatrix { get; set; }
        public string[] PageFaults { get; set; }
    }

}
