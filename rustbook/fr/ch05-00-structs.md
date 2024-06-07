<!-- # Using Structs to Structure Related Data -->

# Utiliser les structures pour structurer des données apparentées

<!--
A *struct*, or *structure*, is a custom data type that lets you package
together and name multiple related values that make up a meaningful group. If
you’re familiar with an object-oriented language, a *struct* is like an
object’s data attributes. In this chapter, we’ll compare and contrast tuples
with structs to build on what you already know and demonstrate when structs are
a better way to group data. We’ll demonstrate how to define and instantiate
structs. We’ll discuss how to define associated functions, especially the kind
of associated functions called *methods*, to specify behavior associated with a
struct type. Structs and enums (discussed in Chapter 6) are the building blocks
for creating new types in your program’s domain to take full advantage of
Rust’s compile time type checking.
-->

Une *struct*, ou *structure*, est un type de données personnalisé qui vous
permet de rassembler plusieurs valeurs associées et les nommer pour former un
groupe cohérent.
Si vous êtes familier avec un langage orienté objet, une structure est en
quelque sorte l'ensemble des attributs d'un objet.
Dans ce chapitre, nous comparerons les tuples avec les structures afin de
construire ce que vous connaissez déjà et de montrer à quels moments les
structures sont plus pertinentes pour grouper des données. Nous verrons comment
définir les fonctions associées, en particulier le type de fonctions associées
que l'on appelle les *méthodes*, dans le but d'implémenter un comportement
associé au type d'une structure.
Les structures et les énumérations (traitées au chapitre 6) sont les fondements
de la création de nouveaux types au sein de votre programme pour tirer
pleinement parti des vérifications de types effectuées par Rust à la
compilation.
