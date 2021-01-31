using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Infrastructure.Utils
{
    public class DateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.GetDateTime();
        }
         public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options) 
         {
        string jsonDateTimeFormat = DateTime.SpecifyKind(value, DateTimeKind.Utc)
            .ToString("o", System.Globalization.CultureInfo.InvariantCulture);
 
        writer.WriteStringValue(jsonDateTimeFormat);
         }
    }
}