using BackendDATN.Data.Response;
using BackendDATN.Entity.VM.StudentClass;
using BackendDATN.IServices;
using Microsoft.AspNetCore.Mvc;

namespace BackendDATN.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StudentClassController : ControllerBase
    {
        private readonly IStudentClassServ _studentClassServ;

        public StudentClassController(IStudentClassServ studentClassServ)
        {
            _studentClassServ = studentClassServ;
        }

        [HttpGet("{classId}")]
        public async Task<IActionResult> GetAll(int classId, string? search = null)
        {
            try
            {
                return Ok(await _studentClassServ.GetAll(classId, search));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add(StudentClassModel studentClassModel)
        {
            try
            {
                await _studentClassServ.AddAsync(studentClassModel);
                return Ok(new MessageResponse
                {
                    Message = "Success"
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(new MessageResponse
                {
                    Message = "Fail"
                });
            }
        }

        [HttpPost("add-list")]
        public async Task<IActionResult> AddList(List<StudentClassModel> studentClassModels)
        {
            try
            {
                await _studentClassServ.AddListAsync(studentClassModels);
                return Ok(new MessageResponse
                {
                    Message = "Success"
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(new MessageResponse
                {
                    Message = "Fail"
                });
            }
        }

        [HttpPut("{id}/{classId}")]
        public async Task<IActionResult> Update(int id, int classId)
        {
            try
            {
                await _studentClassServ.UpdateAsync(id, classId);
                return Ok(new MessageResponse
                {
                    Message = "Success"
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(new MessageResponse
                {
                    Message = "Fail"
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _studentClassServ.DeleteAsync(id);
                return Ok(new MessageResponse
                {
                    Message = "Success"
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(new MessageResponse
                {
                    Message = "Fail"
                });
            }
        }

    }
}
