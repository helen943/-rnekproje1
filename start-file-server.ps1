param(
    [int]$Port = 8000,
    [string]$Path = (Get-Location).Path
)

Add-Type @"
using System;
using System.Net;
using System.IO;
using System.Text;

public class SimpleFileServer
{
    private HttpListener _listener;
    private string _root;

    public SimpleFileServer(string prefix, string root)
    {
        _listener = new HttpListener();
        _listener.Prefixes.Add(prefix);
        _root = root;
    }

    public void Start()
    {
        _listener.Start();
        while (true)
        {
            var context = _listener.GetContext();
            var request = context.Request;
            var response = context.Response;

            string urlPath = Uri.UnescapeDataString(request.Url.AbsolutePath.TrimStart('/'));
            if (string.IsNullOrEmpty(urlPath)) urlPath = "index.html";
            string filePath = Path.Combine(_root, urlPath.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(filePath))
            {
                try
                {
                    byte[] content = File.ReadAllBytes(filePath);
                    response.ContentLength64 = content.Length;
                    response.OutputStream.Write(content, 0, content.Length);
                }
                catch (Exception ex)
                {
                    byte[] err = Encoding.UTF8.GetBytes("Internal Server Error: " + ex.Message);
                    response.StatusCode = 500;
                    response.OutputStream.Write(err, 0, err.Length);
                }
            }
            else
            {
                response.StatusCode = 404;
                byte[] notfound = Encoding.UTF8.GetBytes("404 - Not Found");
                response.OutputStream.Write(notfound, 0, notfound.Length);
            }

            response.OutputStream.Close();
        }
    }
}
"@

$prefix = "http://localhost:$Port/"
$server = New-Object SimpleFileServer $prefix, $Path
Write-Host "Serving $Path on $prefix"
$server.Start()
