using Invitation.Api.Models;
using System;
using System.Collections.Generic;

namespace Invitation.Api.Services
{
    public class TestData
    {
        private const string userId = "112813386652595603642";

        public List<Event> GetEvents() => new List<Event>
        {
            new Event { Id = "1", UserId = userId, Description = "Betty's wedding", Date = new DateTime(2018, 3, 4), Messages = GetMessagesForEvent1(), PersonStatuses = GetPersonStatusesForEvent1() },
            new Event { Id = "2", UserId = userId, Description = "Lenny's birthday party", Date = new DateTime(2018, 4, 18), Messages = GetMessagesForEvent2(), PersonStatuses = GetPersonStatusesForEvent2() }
        };

        public List<Person> GetPeople() => new List<Person>
        {
            new Person { Id = "1", UserId = userId, FirstName = "Bob", LastName = "Pendergast", Phone = "+11111111111" },
            new Person { Id = "2", UserId = userId, FirstName = "Sue", LastName = "Finklestein", Phone = "+12222222222" },
            new Person { Id = "3", UserId = userId, FirstName = "Jim", LastName = "Forrestor", Phone = "+13333333333" },
            new Person { Id = "4", UserId = userId, FirstName = "Craig", LastName = "Pattington", Phone = "+14444444444" },
            new Person { Id = "5", UserId = userId, FirstName = "Olly", LastName = "Fowler", Phone = "+15555555555" },
            new Person { Id = "6", UserId = userId, FirstName = "Phil", LastName = "Pumpernickel", Phone = "+16666666666" }
        };

        private List<Message> GetMessagesForEvent1() => new List<Message>
        {
            new Message { Id = "1", Content = "Hey all. Betty is having a wedding.", Date = new DateTime(2018, 1, 5) },
            new Message { Id = "2", Content = "Don't forget about Betty's wedding.", Date = new DateTime(2018, 1, 22) }
        };

        private List<Message> GetMessagesForEvent2() => new List<Message>
        {
            new Message { Id = "3", Content = "Come to Lenny's 21st birthday party.", Date = new DateTime(2018, 2, 9) },
            new Message { Id = "4", Content = "We have moved locations of Lenny's party.", Date = new DateTime(2018, 2, 28) }
        };

        private List<PersonStatus> GetPersonStatusesForEvent1() => new List<PersonStatus>
        {
            new PersonStatus { Id = "1", PersonId = "1", Status = Status.Yes },
            new PersonStatus { Id = "2", PersonId = "2", Status = Status.NoResponse },
            new PersonStatus { Id = "3", PersonId = "3", Status = Status.Maybe }
        };

        private List<PersonStatus> GetPersonStatusesForEvent2() => new List<PersonStatus>
        {
            new PersonStatus { Id = "4", PersonId = "4", Status = Status.Yes },
            new PersonStatus { Id = "5", PersonId = "5", Status = Status.No },
            new PersonStatus { Id = "6", PersonId = "6", Status = Status.NotPrompted }
        };
    }
}