﻿using AutoMapper;
using BackendDATN.Data;
using BackendDATN.Data.Response;
using BackendDATN.Data.VM.Assign;
using BackendDATN.Entity.VM.Assign;
using BackendDATN.Helper;
using BackendDATN.IServices;
using Microsoft.EntityFrameworkCore;

namespace BackendDATN.Services
{
    public class AssignServ : IAssignServ
    {
        private readonly BackendContext _context;

        private readonly IMapper _mapper;

        public static int PAGE_SIZE { get; set; } = 10;

        public AssignServ(BackendContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AssignVM> AddAsync(AssignModel assignModel)
        {
            var data = new Assign
            {
                Id = Guid.NewGuid(),
                SemesterId = assignModel.SemesterId,
                SubjectId = assignModel.SubjectId,
                ClassId = assignModel.ClassId,
                TeacherId = assignModel.TeacherId,
            };

            await _context.AddAsync(data);
            await _context.SaveChangesAsync();

            return _mapper.Map<AssignVM>(data);
        }

        public async Task DeleteAsync(Guid id)
        {
            var data = _context.Assigns.SingleOrDefault(ass => ass.Id == id);
            if(data != null)
            {
                _context.Remove(data);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<AssignVM>> GetAllAsync()
        {
            var data = await _context.Assigns.ToListAsync();
            
            return _mapper.Map<List<AssignVM>>(data);
        }

        public async Task<AssignVM?> GetByIdAsync(Guid id)
        {
            return _mapper.Map<AssignVM>(await _context.Assigns.FindAsync(id));
            
        }

        public async Task<AssignResponse> GetByPageAsync(int grade, int subjectId, int semesterId, string? search, int page = 1)
        {
            var assigns = await _context.Assigns.ToListAsync();
            var classes = await _context.Classes.ToListAsync();
            var dataAssign = assigns.AsQueryable();
            var dataClass = classes.AsQueryable();

            var data = dataClass.Where(c => c.Grade == grade)
                                .Join(dataAssign.Where(ass => ass.SubjectId == subjectId && ass.SemesterId == semesterId),
                                      c => c.Id,
                                      ass => ass.ClassId,
                                      (c, ass) => new AssignRepModel
                                      {
                                          Id = ass.Id,
                                          ClassId = c.Id,
                                          ClassName = c.Name,
                                          TeacherId = ass.TeacherId,
                                          TeacherName = _context.Teachers.Find(ass.TeacherId)!.FullName,
                                          SubjectId = ass.SubjectId,
                                          SubjectName = _context.Subjects.Find(ass.SubjectId)!.Name,
                                          SemesterId = ass.SemesterId,
                                          SemesterName = _context.Semesters.Find(ass.SemesterId)!.Name
                                      });
            if (!string.IsNullOrEmpty(search))
            {
                data = data.Where(da => da.ClassName.Contains(search) || da.TeacherName.Contains(search));
            }
            var result = PaginatedList<AssignRepModel>.Create(data, page, PAGE_SIZE);

            var res = result.ToList();

            return new AssignResponse
            {
                Data = res,
                HasPreviousPage = result.HasPreviousPage,
                HasNextPage = result.HasNextPage,
            };

        }

        public async Task UpdateAsync(AssignVM assignVM)
        {
            var data = await _context.Assigns.FindAsync(assignVM.Id);
            if (data != null)
            {
                data.SemesterId = assignVM.SemesterId;
                data.SubjectId = assignVM.SubjectId;
                data.ClassId = assignVM.ClassId;
                data.TeacherId = assignVM.TeacherId;
                await _context.SaveChangesAsync();
            }
        }
    }
}
