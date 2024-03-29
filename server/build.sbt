
name := """server"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

resolvers += Resolver.sonatypeRepo("snapshots")

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  javaWs,
  "mysql" % "mysql-connector-java" % "5.1.18",
  "com.google.inject" % "guice" % "3.0",
  "com.amazonaws" % "aws-java-sdk" % "1.9.6",
  "org.apache.commons"%"commons-math"%"2.2"
)



