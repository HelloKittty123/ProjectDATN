using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendDATN.Entity.VM.Conduct
{
    public class ConductModel
    {
        public int Mark { get; set; }

        public string Comment { get; set; }

        public int SemesterId { get; set; }

        public string StudentId { get; set; }
    }
}
