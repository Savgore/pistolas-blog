// Header and not-found artwork.
//
// To swap either image: drop the file in /assets/paintings/ and change the two
// lines below. The attribution line in the footer is built from `credit`, so
// nothing else needs editing.
//
// Header images must be cropped to roughly 6.2:1 and served from this domain —
// the header effect reads the image's pixels back off a canvas, and a
// cross-origin image would block that. The not-found image has no such
// constraints; it is a plain <img> at whatever shape it comes in.

module.exports = {
    header: {
        src: "/assets/paintings/ninth-wave.jpg",
        credit: "Ivan Aivazovsky, The Ninth Wave, 1850",
    },
    lost: {
        src: "/assets/paintings/temeraire.jpg",
        credit: "J. M. W. Turner, The Fighting Temeraire tugged to her last berth to be broken up, 1839",
    },
};
