namespace OsTrainer.Server.Models.Common
{
    public interface IArrayValueEntity
    {
        int ArrayIndexX { get; set; }
        int ArrayIndexY { get; set; }
        string Value { get; set; }
    }

    public class ArrayValue : IArrayValueEntity
    {
        public int ArrayIndexX { get; set; }
        public int ArrayIndexY { get; set; }
        public string Value { get; set; }
    }
}
