function init() {
    if (document.body) {
        var e = document.body,
            t = document.documentElement,
            n = window.innerHeight,
            o = e.scrollHeight;
        if (root = document.compatMode.indexOf("CSS") >= 0 ? t : e, activeElement = e, initdone = !0, top != self) frame = !0;
        else if (o > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
            var a = !1,
                r = function() {
                    a || t.scrollHeight == document.height || (a = !0, setTimeout(function() {
                        t.style.height = document.height + "px", a = !1
                    }, 500))
                };
            if (t.style.height = "", setTimeout(r, 10), addEvent("DOMNodeInserted", r), addEvent("DOMNodeRemoved", r), root.offsetHeight <= n) {
                var i = document.createElement("div");
                i.style.clear = "both", e.appendChild(i)
            }
        }
        if (document.URL.indexOf("mail.google.com") > -1) {
            var l = document.createElement("style");
            l.innerHTML = ".iu { visibility: hidden }", (document.getElementsByTagName("head")[0] || t).appendChild(l)
        }
        fixedback || disabled || (e.style.backgroundAttachment = "scroll", t.style.backgroundAttachment = "scroll")
    }
}

function scrollArray(e, t, n, o) {
    if (o || (o = 1e3), directionCheck(t, n), acceleration) {
        var a = +new Date,
            r = a - lastScroll;
        if (accelDelta > r) {
            var i = (1 + 30 / r) / 2;
            i > 1 && (i = Math.min(i, accelMax), t *= i, n *= i)
        }
        lastScroll = +new Date
    }
    if (que.push({
            x: t,
            y: n,
            lastX: 0 > t ? .99 : -.99,
            lastY: 0 > n ? .99 : -.99,
            start: +new Date
        }), !pending) {
        var l = e === document.body,
            c = function() {
                for (var a = +new Date, r = 0, i = 0, s = 0; s < que.length; s++) {
                    var d = que[s],
                        u = a - d.start,
                        m = u >= animtime,
                        f = m ? 1 : u / animtime;
                    pulseAlgorithm && (f = pulse(f));
                    var h = d.x * f - d.lastX >> 0,
                        p = d.y * f - d.lastY >> 0;
                    r += h, i += p, d.lastX += h, d.lastY += p, m && (que.splice(s, 1), s--)
                }
                l ? window.scrollBy(r, i) : (r && (e.scrollLeft += r), i && (e.scrollTop += i)), t || n || (que = []), que.length ? requestFrame(c, e, o / framerate + 1) : pending = !1
            };
        requestFrame(c, e, 0), pending = !0
    }
}

function wheel(e) {
    initdone || init();
    var t = e.target,
        n = overflowingAncestor(t);
    if (!n || e.defaultPrevented || isNodeName(activeElement, "embed") || isNodeName(t, "embed") && /\.pdf/i.test(t.src)) return !0;
    var o = e.wheelDeltaX || 0,
        a = e.wheelDeltaY || 0;
    o || a || (a = e.wheelDelta || 0), Math.abs(o) > 1.2 && (o *= stepsize / 120), Math.abs(a) > 1.2 && (a *= stepsize / 120), scrollArray(n, -o, -a), e.preventDefault()
}

function keydown(e) {
    var t = e.target,
        n = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== key.spacebar;
    if (/input|textarea|select|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) return !0;
    if (isNodeName(t, "button") && e.keyCode === key.spacebar) return !0;
    var o, a = 0,
        r = 0,
        i = overflowingAncestor(activeElement),
        l = i.clientHeight;
    switch (i == document.body && (l = window.innerHeight), e.keyCode) {
        case key.up:
            r = -arrowscroll;
            break;
        case key.down:
            r = arrowscroll;
            break;
        case key.spacebar:
            o = e.shiftKey ? 1 : -1, r = -o * l * .9;
            break;
        case key.pageup:
            r = .9 * -l;
            break;
        case key.pagedown:
            r = .9 * l;
            break;
        case key.home:
            r = -i.scrollTop;
            break;
        case key.end:
            var c = i.scrollHeight - i.scrollTop - l;
            r = c > 0 ? c + 10 : 0;
            break;
        case key.left:
            a = -arrowscroll;
            break;
        case key.right:
            a = arrowscroll;
            break;
        default:
            return !0
    }
    scrollArray(i, a, r), e.preventDefault()
}

function mousedown(e) {
    activeElement = e.target
}

function setCache(e, t) {
    for (var n = e.length; n--;) cache[uniqueID(e[n])] = t;
    return t
}

function overflowingAncestor(e) {
    var t = [],
        n = root.scrollHeight;
    do {
        var o = cache[uniqueID(e)];
        if (o) return setCache(t, o);
        if (t.push(e), n === e.scrollHeight) {
            if (!frame || root.clientHeight + 10 < n) return setCache(t, document.body)
        } else if (e.clientHeight + 10 < e.scrollHeight && (overflow = getComputedStyle(e, "").getPropertyValue("overflow-y"), "scroll" === overflow || "auto" === overflow)) return setCache(t, e)
    } while (e = e.parentNode)
}

function addEvent(e, t, n) {
    window.addEventListener(e, t, n || !1)
}

function removeEvent(e, t, n) {
    window.removeEventListener(e, t, n || !1)
}

function isNodeName(e, t) {
    return (e.nodeName || "").toLowerCase() === t.toLowerCase()
}

function directionCheck(e, t) {
    e = e > 0 ? 1 : -1, t = t > 0 ? 1 : -1, (direction.x !== e || direction.y !== t) && (direction.x = e, direction.y = t, que = [], lastScroll = 0)
}

function pulse_(e) {
    var t, n, o;
    return e *= pulseScale, 1 > e ? t = e - (1 - Math.exp(-e)) : (n = Math.exp(-1), e -= 1, o = 1 - Math.exp(-e), t = n + o * (1 - n)), t * pulseNormalize
}

function pulse(e) {
    return e >= 1 ? 1 : 0 >= e ? 0 : (1 == pulseNormalize && (pulseNormalize /= pulse_(1)), pulse_(e))
}
var framerate = 300,
    animtime = 1600,
    stepsize = 100,
    pulseAlgorithm = !0,
    pulseScale = 8,
    pulseNormalize = 1,
    acceleration = !0,
    accelDelta = 15,
    accelMax = 1,
    keyboardsupport = !0,
    disableKeyboard = !1,
    arrowscroll = 50,
    exclude = "",
    disabled = !1,
    frame = !1,
    direction = {
        x: 0,
        y: 0
    },
    initdone = !1,
    fixedback = !0,
    root = document.documentElement,
    activeElement, key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    },
    que = [],
    pending = !1,
    lastScroll = +new Date,
    cache = {};
setInterval(function() {
    cache = {}
}, 1e4);
var uniqueID = function() {
        var e = 0;
        return function(t) {
            return t.uniqueID || (t.uniqueID = e++)
        }
    }(),
    requestFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(e, t, n) {
            window.setTimeout(e, n || 1e3 / 60)
        }
    }();
addEvent("mousedown", mousedown), addEvent("mousewheel", wheel), addEvent("load", init);
