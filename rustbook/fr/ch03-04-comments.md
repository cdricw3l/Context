<!--
## Comments
-->

## Les commentaires

<!--
All programmers strive to make their code easy to understand, but sometimes
extra explanation is warranted. In these cases, programmers leave *comments* in
their source code that the compiler will ignore but people reading the source
code may find useful.
-->

Tous les développeurs s'efforcent de rendre leur code facile à comprendre, mais
parfois il est nécessaire d'écrire des explications supplémentaires. Dans ce
cas, les développeurs laissent des *commentaires* dans leur code source que le
compilateur va ignorer mais qui peuvent être utiles pour les personnes qui
lisent le code source.

<!--
Here’s a simple comment:
-->

Voici un simple commentaire :

<!--
```rust
// hello, world
```
-->

```rust
// hello, world
```

<!--
In Rust, the idiomatic comment style starts a comment with two slashes, and the
comment continues until the end of the line. For comments that extend beyond a
single line, you’ll need to include `//` on each line, like this:
-->

Avec Rust, les commentaires classiques commencent avec deux barres obliques et
continuent jusqu'à la fin de la ligne. Pour les commentaires qui font plus
d'une seule ligne, vous aurez besoin d'ajouter `//` sur chaque ligne, comme
ceci :

<!--
```rust
// So we’re doing something complicated here, long enough that we need
// multiple lines of comments to do it! Whew! Hopefully, this comment will
// explain what’s going on.
```
-->

```rust
// Donc ici on fait quelque chose de compliqué, tellement long que nous avons
// besoin de plusieurs lignes de commentaires pour le faire ! Heureusement,
// ce commentaire va expliquer ce qui se passe.
```

<!--
Comments can also be placed at the end of lines containing code:
-->

Les commentaires peuvent aussi être aussi ajoutés à la fin d'une ligne qui
contient du code :

<!--
<span class="filename">Filename: src/main.rs</span>
-->

<span class="filename">Fichier : src/main.rs</span>

<!--
```rust
{{#rustdoc_include ../listings-sources/ch03-common-programming-concepts/no-listing-24-comments-end-of-line/src/main.rs}}
```
-->

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-24-comments-end-of-line/src/main.rs}}
```

<!--
But you’ll more often see them used in this format, with the comment on a
separate line above the code it’s annotating:
-->

Mais parfois, vous pourrez les voir utilisés de cette manière, avec le
commentaire sur une ligne séparée au-dessus du code qu'il annote :

<!--
<span class="filename">Filename: src/main.rs</span>
-->

<span class="filename">Fichier : src/main.rs</span>

<!--
```rust
{{#rustdoc_include ../listings-sources/ch03-common-programming-concepts/no-listing-25-comments-above-line/src/main.rs}}
```
-->

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-25-comments-above-line/src/main.rs}}
```

<!--
Rust also has another kind of comment, documentation comments, which we’ll
discuss in the “Publishing a Crate to Crates.io” section of Chapter 14.
-->

Rust a aussi un autre type de commentaire, les commentaires de documentation,
que nous aborderons au chapitre 14.
