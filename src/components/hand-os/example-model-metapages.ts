export const RotateObject1 = {
    "meta": {
      "layouts": {
        "presentation": "view",
        "react-grid-layout": {
          "props": {
            "cols": 12,
            "margin": [
              10,
              20
            ],
            "rowHeight": 100,
            "containerPadding": [
              5,
              5
            ]
          },
          "layout": [
            {
              "h": 5,
              "i": "view",
              "w": 5,
              "x": 5,
              "y": 0,
              "moved": false,
              "static": false
            },
            {
              "h": 2,
              "i": "device-io",
              "w": 5,
              "x": 0,
              "y": 0,
              "moved": false,
              "static": false
            }
          ]
        }
      },
      "description": "Get basic example of 3D rotation in babylon.js using phone orientation\n\nOne direction working!\n"
    },
    "version": "0.3",
    "metaframes": {
      "view": {
        "url": "https://js.mtfm.io/?v=1&c=eyJtb2R1bGVzIjpbImh0dHBzOi8vY2RuLmJhYnlsb25qcy5jb20vYmFieWxvbi5qcyIsImh0dHBzOi8vY2RuLmJhYnlsb25qcy5jb20vbG9hZGVycy9iYWJ5bG9uanMubG9hZGVycy5taW4uanMiLCJodHRwczovL2NvZGUuanF1ZXJ5LmNvbS9wZXAvMC40LjMvcGVwLmpzIiwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9xdWF0ZXJuaW9uQDEuNC4xL3F1YXRlcm5pb24ubWluLmpzIl19#?js=Y29uc3QgZGlzcG9zZXJzID0gW107CmNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpOwp3aGlsZSAocm9vdC5maXJzdENoaWxkKSB7CiAgcm9vdC5yZW1vdmVDaGlsZChyb290Lmxhc3RDaGlsZCk7Cn0KCmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImNhbnZhcyIpOwpjYW52YXMuc2V0QXR0cmlidXRlKCJ0b3VjaC1hY3Rpb24iLCAibm9uZSIpOwpjYW52YXMuaWQgPSAicmVuZGVyQ2FudmFzIjsKY2FudmFzLndpZHRoID0gNTAwOwpjYW52YXMuaGVpZ2h0ID0gNTAwOwpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLmFwcGVuZENoaWxkKGNhbnZhcyk7CmNvbnN0IGVuZ2luZSA9IG5ldyBCQUJZTE9OLkVuZ2luZShjYW52YXMsIHRydWUpOyAvLyBHZW5lcmF0ZSB0aGUgQkFCWUxPTiAzRCBlbmdpbmUKCmxldCBjYW1lcmE7Cgp2YXIgY3JlYXRlU2NlbmUgPSBmdW5jdGlvbiAoKSB7CiAgdmFyIHNjZW5lID0gbmV3IEJBQllMT04uU2NlbmUoZW5naW5lKTsKICBzY2VuZS5jbGVhckNvbG9yID0gbmV3IEJBQllMT04uQ29sb3IzKDAsIDAsIDApOwoKICAvLyBBcmNSb3RhdGVDYW1lcmEgY2FtZXJhIHN0YXJ0OgogICAgY2FtZXJhID0gbmV3IEJBQllMT04uQXJjUm90YXRlQ2FtZXJhKAogICAgICAiY2FtIiwKICAgICAgLU1hdGguUEkgLyAyLCAKICAgICAgTWF0aC5QSSAvIDIsCiAgICAgIDIwLAogICAgICBCQUJZTE9OLlZlY3RvcjMuWmVybygpCiAgICApOwoKICAgIGNhbWVyYS53aGVlbERlbHRhUGVyY2VudGFnZSA9IDAuMDE7CiAgICBjYW1lcmEuYXR0YWNoQ29udHJvbChjYW52YXMsIHRydWUpOwogICAgLy8gY2FtZXJhLnVwcGVyQmV0YUxpbWl0ID0gMS43NTsKICAgIGNhbWVyYS51cHBlckJldGFMaW1pdCA9IDMuMTQKICAgIGNhbWVyYS5sb3dlckJldGFMaW1pdCA9IC0zLjE0OyAvLzAKICAvLyBjYW1lcmEgZW5kCgogIC8vIE1hdGVyaWFsCiAgdmFyIGdyb3VuZE1hdCA9IG5ldyBCQUJZTE9OLlBCUk1hdGVyaWFsKCJncm91bmRNYXQiLCBzY2VuZSk7CiAgZ3JvdW5kTWF0LmFsYmVkb0NvbG9yID0gbmV3IEJBQllMT04uQ29sb3I0KDYzIC8gMjU1LCA1MiAvIDI1NSwgOTcgLyAyNTUsIDEpOwogIGdyb3VuZE1hdC5tZXRhbGxpYyA9IDA7CiAgZ3JvdW5kTWF0LnJvdWdobmVzcyA9IDAuNDsKICBncm91bmRNYXQuZW52aXJvbm1lbnRJbnRlbnNpdHkgPSAwOwoKICAvLyBHcm91bmQKICB2YXIgZ3JvdW5kID0gQkFCWUxPTi5NZXNoLkNyZWF0ZVBsYW5lKCJncm91bmQiLCA1MDAuMCwgc2NlbmUpOwogIGdyb3VuZC5wb3NpdGlvbiA9IG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgLTEwLCAwKTsKICBncm91bmQucm90YXRpb24gPSBuZXcgQkFCWUxPTi5WZWN0b3IzKE1hdGguUEkgLyAyLCAwLCAwKTsKICBncm91bmQubWF0ZXJpYWwgPSBncm91bmRNYXQ7CgogIC8vIExpZ2h0cwogIHZhciBsaWdodCA9IG5ldyBCQUJZTE9OLlBvaW50TGlnaHQoCiAgICAicG9pbnRMaWdodCIsCiAgICBuZXcgQkFCWUxPTi5WZWN0b3IzKC0xNywgNjgsIC01KSwKICAgIHNjZW5lCiAgKTsKICBsaWdodC5pbnRlbnNpdHkgPSAxMDAwOwogIGxpZ2h0LmluY2x1ZGVkT25seU1lc2hlcy5wdXNoKGdyb3VuZCk7CgogIC8vIEVudmlyb25tZW50CiAgdmFyIGhkclRleHR1cmUgPSBCQUJZTE9OLkN1YmVUZXh0dXJlLkNyZWF0ZUZyb21QcmVmaWx0ZXJlZERhdGEoCiAgICAiaHR0cHM6Ly9wbGF5Z3JvdW5kLmJhYnlsb25qcy5jb20vdGV4dHVyZXMvU3R1ZGlvX1NvZnRib3hfMlVtYnJlbGxhc19jdWJlX3NwZWN1bGFyLmRkcyIsCiAgICBzY2VuZQogICk7CiAgaGRyVGV4dHVyZS5uYW1lID0gImVudlRleCI7CiAgaGRyVGV4dHVyZS5nYW1tYVNwYWNlID0gZmFsc2U7CiAgaGRyVGV4dHVyZS5zZXRSZWZsZWN0aW9uVGV4dHVyZU1hdHJpeChCQUJZTE9OLk1hdHJpeC5Sb3RhdGlvblkoMi40KSk7CiAgc2NlbmUuZW52aXJvbm1lbnRUZXh0dXJlID0gaGRyVGV4dHVyZTsKCiAgdmFyIGNjTWFzayA9IG5ldyBCQUJZTE9OLlRleHR1cmUoCiAgICAiaHR0cHM6Ly9tb2RlbHMuYmFieWxvbmpzLmNvbS9EZW1vcy9zaGFkZXJCYWxsL1NoYWRlckJhbGxNYXRfY2xlYXJDb2F0LnBuZyIsCiAgICBzY2VuZSwKICAgIHVuZGVmaW5lZCwKICAgIGZhbHNlCiAgKTsKCiAgUHJvbWlzZS5hbGwoWwogICAgQkFCWUxPTi5TY2VuZUxvYWRlci5BcHBlbmRBc3luYygKICAgICAgImh0dHBzOi8vbW9kZWxzLmJhYnlsb25qcy5jb20vRGVtb3Mvc2hhZGVyQmFsbC9CYWJ5bG9uU2hhZGVyQmFsbF9TaW1wbGUuZ2x0ZiIKICAgICksCiAgXSkudGhlbihmdW5jdGlvbiAoKSB7CiAgICAvLyBFbmFibGUgY2xlYXIgY29hdCBvbiBtYXRlcmlhbAogICAgdmFyIG1haW5NYXQgPSBzY2VuZS5nZXRNYXRlcmlhbEJ5TmFtZSgiU2hhZGVyQmFsbE1hdCIpOwogICAgbWFpbk1hdC5jbGVhckNvYXQuaXNFbmFibGVkID0gdHJ1ZTsKICAgIG1haW5NYXQuY2xlYXJDb2F0LnRleHR1cmUgPSBjY01hc2s7CgogICAgLy8gU2V0IHVwIG5ldyByZW5kZXJpbmcgcGlwZWxpbmUKICAgIHZhciBwaXBlbGluZSA9IG5ldyBCQUJZTE9OLkRlZmF1bHRSZW5kZXJpbmdQaXBlbGluZSgiZGVmYXVsdCIsIHRydWUsIHNjZW5lKTsKCiAgICAvLyBUb25lIG1hcHBpbmcKICAgIHBpcGVsaW5lLnRvbmVNYXBwaW5nRW5hYmxlZCA9IHRydWU7CiAgICBwaXBlbGluZS50b25lTWFwcGluZ1R5cGUgPQogICAgICBCQUJZTE9OLkltYWdlUHJvY2Vzc2luZ0NvbmZpZ3VyYXRpb24uVE9ORU1BUFBJTkdfQUNFUzsKICAgIHBpcGVsaW5lLmV4cG9zdXJlID0gMTsKCiAgICBwaXBlbGluZS5meGFhRW5hYmxlZCA9IHRydWU7CgogICAgLy8gR2xvdyBMYXllcgogICAgdmFyIGdsID0gbmV3IEJBQllMT04uR2xvd0xheWVyKCJnbG93Iiwgc2NlbmUsIHsKICAgICAgbWFpblRleHR1cmVGaXhlZFNpemU6IDEwMjQsCiAgICAgIGJsdXJLZXJuZWxTaXplOiA2NCwKICAgIH0pOwogICAgZ2wuaW50ZW5zaXR5ID0gMC44OwogIH0pOwoKICByZXR1cm4gc2NlbmU7Cn07Cgpjb25zdCBzY2VuZSA9IGNyZWF0ZVNjZW5lKCk7IC8vQ2FsbCB0aGUgY3JlYXRlU2NlbmUgZnVuY3Rpb24KLy8gUmVnaXN0ZXIgYSByZW5kZXIgbG9vcCB0byByZXBlYXRlZGx5IHJlbmRlciB0aGUgc2NlbmUKZW5naW5lLnJ1blJlbmRlckxvb3AoKCkgPT4gewogIHNjZW5lLnJlbmRlcigpOwp9KTsKLy8gV2F0Y2ggZm9yIGJyb3dzZXIvY2FudmFzIHJlc2l6ZSBldmVudHMKd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoInJlc2l6ZSIsICgpID0+IHsKICBlbmdpbmUucmVzaXplKCk7Cn0pOwoKLy8gTGlzdGVuIHRvIGFuIGlucHV0CmRpc3Bvc2Vycy5wdXNoKAogIG1ldGFmcmFtZS5vbklucHV0KCJhbyIsIChvcmllbnRhdGlvbikgPT4gewogICAgaWYgKCFvcmllbnRhdGlvbikgewogICAgICByZXR1cm47CiAgICB9CiAgICBpZiAoY2FtZXJhKSB7CiAgICAgIGNhbWVyYS5hbHBoYSA9IC1vcmllbnRhdGlvblswXTsKICAgICAgY2FtZXJhLmJldGEgPSBvcmllbnRhdGlvblsyXTsKICAgIH0KICB9KQopOwoKLy8gUmV0dXJuIGEgY2xlYW51cCBmdW5jdGlvbgpyZXR1cm4gKCkgPT4gewogIHdoaWxlIChkaXNwb3NlcnMubGVuZ3RoID4gMCkgewogICAgZGlzcG9zZXJzLnBvcCgpKCk7CiAgfQp9Owo=&options=eyJhdXRvc2VuZCI6ZmFsc2UsImhpZGVtZW51aWZpZnJhbWUiOnRydWUsIm1vZGUiOiJqYXZhc2NyaXB0Iiwic2F2ZWxvYWRpbmhhc2giOnRydWUsInRoZW1lIjoibGlnaHQifQ==&text=Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiY2FudmFzIik7CmNhbnZhcy5zZXRBdHRyaWJ1dGUoInRvdWNoLWFjdGlvbiIsICJub25lIikgCmNhbnZhcy5pZCA9ICJyZW5kZXJDYW52YXMiOwpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgicm9vdCIpLmFwcGVuZENoaWxkKGNhbnZhcyk7CmNvbnN0IGVuZ2luZSA9IG5ldyBCQUJZTE9OLkVuZ2luZShjYW52YXMsIHRydWUpOyAvLyBHZW5lcmF0ZSB0aGUgQkFCWUxPTiAzRCBlbmdpbmUKCnZhciBjcmVhdGVTY2VuZSA9IGZ1bmN0aW9uICgpIHsKICAgIC8vIFRoaXMgY3JlYXRlcyBhIGJhc2ljIEJhYnlsb24gU2NlbmUgb2JqZWN0IChub24tbWVzaCkKICAgIHZhciBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKGVuZ2luZSk7CgogICAgLy8gVGhpcyBjcmVhdGVzIGFuZCBwb3NpdGlvbnMgYSBmcmVlIGNhbWVyYSAobm9uLW1lc2gpCiAgICB2YXIgY2FtZXJhID0gbmV3IEJBQllMT04uRnJlZUNhbWVyYSgiY2FtZXJhMSIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgNSwgLTEwKSwgc2NlbmUpOwoKICAgIC8vIFRoaXMgdGFyZ2V0cyB0aGUgY2FtZXJhIHRvIHNjZW5lIG9yaWdpbgogICAgY2FtZXJhLnNldFRhcmdldChCQUJZTE9OLlZlY3RvcjMuWmVybygpKTsKCiAgICAvLyBUaGlzIGF0dGFjaGVzIHRoZSBjYW1lcmEgdG8gdGhlIGNhbnZhcwogICAgY2FtZXJhLmF0dGFjaENvbnRyb2woY2FudmFzLCB0cnVlKTsKCiAgICAvLyBUaGlzIGNyZWF0ZXMgYSBsaWdodCwgYWltaW5nIDAsMSwwIC0gdG8gdGhlIHNreSAobm9uLW1lc2gpCiAgICB2YXIgbGlnaHQgPSBuZXcgQkFCWUxPTi5IZW1pc3BoZXJpY0xpZ2h0KCJsaWdodCIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgMCksIHNjZW5lKTsKCiAgICAvLyBEZWZhdWx0IGludGVuc2l0eSBpcyAxLiBMZXQncyBkaW0gdGhlIGxpZ2h0IGEgc21hbGwgYW1vdW50CiAgICBsaWdodC5pbnRlbnNpdHkgPSAwLjc7CgogICAgLy8gT3VyIGJ1aWx0LWluICdzcGhlcmUnIHNoYXBlLgogICAgdmFyIHNwaGVyZSA9IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlU3BoZXJlKCJzcGhlcmUiLCB7ZGlhbWV0ZXI6IDUsIHNlZ21lbnRzOiAzMn0sIHNjZW5lKTsKCiAgICAvLyBNb3ZlIHRoZSBzcGhlcmUgdXB3YXJkIDEvMiBpdHMgaGVpZ2h0CiAgICBzcGhlcmUucG9zaXRpb24ueSA9IDE7CgogICAgLy8gT3VyIGJ1aWx0LWluICdncm91bmQnIHNoYXBlLgogICAgdmFyIGdyb3VuZCA9IEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlR3JvdW5kKCJncm91bmQiLCB7d2lkdGg6IDYsIGhlaWdodDogNn0sIHNjZW5lKTsKCiAgICByZXR1cm4gc2NlbmU7Cn07CgoKY29uc3Qgc2NlbmUgPSBjcmVhdGVTY2VuZSgpOyAvL0NhbGwgdGhlIGNyZWF0ZVNjZW5lIGZ1bmN0aW9uCi8vIFJlZ2lzdGVyIGEgcmVuZGVyIGxvb3AgdG8gcmVwZWF0ZWRseSByZW5kZXIgdGhlIHNjZW5lCmVuZ2luZS5ydW5SZW5kZXJMb29wKGZ1bmN0aW9uICgpIHsKc2NlbmUucmVuZGVyKCk7Cn0pOwovLyBXYXRjaCBmb3IgYnJvd3Nlci9jYW52YXMgcmVzaXplIGV2ZW50cwp3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigicmVzaXplIiwgZnVuY3Rpb24gKCkgewplbmdpbmUucmVzaXplKCk7Cn0pOw==",
        "inputs": [
          {
            "source": "*",
            "target": "*",
            "metaframe": "device-io"
          }
        ]
      },
      "device-io": {
        "url": "https://superslides-router.glitch.me/superslides-output-visualization"
      }
    }
  }