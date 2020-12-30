using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        private readonly HttpStatusCode _code;
        private readonly object _errors;
        public RestException(HttpStatusCode code, object errors = null)
        {
            this._errors = errors;
            this._code = code;
        }

        public object Errors { get; set; }
        public int Code { get; set; }
    }
}