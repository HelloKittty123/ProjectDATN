using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendDATN.Entity.VM.Semester
{
    public class SemesterModel
    {
        public string Name { get; set; }

        public string SchoolYear { get; set; }

        public DateTime TimeStart { get; set; }

        public DateTime TimeEnd { get; set; }
    }
}
